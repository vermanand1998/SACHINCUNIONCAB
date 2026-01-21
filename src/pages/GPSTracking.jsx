import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";
import CommonSection from "../components/UI/CommonSection";
import { googleSheetUrl } from "../urlandKeys";
import "../styles/gps-tracking.css";

// Driver Data (same as DriverCabDetails)
const driversData = [
  { id: 1, cabNo: "CAB-1", driverName: "SIDDHARTH SINGH", driverMobile: "6388499177", vehicleNo: "UP32TN5393" },
  { id: 2, cabNo: "CAB-2", driverName: "RAHUL KASHYAP", driverMobile: "7355713216", vehicleNo: "UP32ZN7576" },
  { id: 3, cabNo: "CAB-3", driverName: "FAIZ KHAN", driverMobile: "6388320195", vehicleNo: "UP32TN4911" },
];

const GPSTracking = () => {
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();
  const isOnJourneyHistoryPage = location.pathname === '/journey-history';

  // Journey State
  const [journeyState, setJourneyState] = useState("idle"); // idle, active, paused
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [journeyId, setJourneyId] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [stops, setStops] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [watchId, setWatchId] = useState(null);
  
  // Anti-cheat tracking state
  const [autoLogInterval, setAutoLogInterval] = useState(null);
  const [gpsLostCount, setGpsLostCount] = useState(0);
  const [lastAutoLog, setLastAutoLog] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveredJourney, setRecoveredJourney] = useState(null);

  // Generate Journey ID
  const generateJourneyId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `JRN${year}${month}${day}${random}`;
  };

  // Get Address from Coordinates (Free Nominatim API)
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await response.json();
      if (data && data.display_name) {
        // Shorten the address
        const parts = data.display_name.split(',').slice(0, 4);
        return parts.join(', ');
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error("Geocoding error:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get Current GPS Location with fallback
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      // Success handler
      const handleSuccess = async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const address = await getAddressFromCoords(latitude, longitude);
        resolve({
          lat: latitude,
          lng: longitude,
          accuracy: accuracy,
          address: address,
          timestamp: new Date().toISOString()
        });
      };

      // Error handler with fallback
      const handleError = (error, isHighAccuracy) => {
        // If high accuracy failed, try with low accuracy (faster, uses network)
        if (isHighAccuracy && error.code === error.TIMEOUT) {
          console.log("High accuracy timeout, trying with network location...");
          navigator.geolocation.getCurrentPosition(
            handleSuccess,
            (fallbackError) => {
              rejectWithMessage(fallbackError, reject);
            },
            {
              enableHighAccuracy: false, // Use network location (faster)
              timeout: 30000, // 30 seconds
              maximumAge: 60000 // Accept 1 minute old position
            }
          );
        } else {
          rejectWithMessage(error, reject);
        }
      };

      const rejectWithMessage = (error, rejectFn) => {
        let errorMsg = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please enable GPS in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location unavailable. Please check if GPS is enabled on your device.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timeout. Please go outside or near a window for better GPS signal.";
            break;
          default:
            errorMsg = "An unknown error occurred. Please refresh and try again.";
        }
        rejectFn(new Error(errorMsg));
      };

      // First try with high accuracy (GPS)
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (error) => handleError(error, true),
        {
          enableHighAccuracy: true, // Try GPS first
          timeout: 20000, // 20 seconds for GPS
          maximumAge: 30000 // Accept 30 seconds old position
        }
      );
    });
  }, []);

  // Watch Position for continuous tracking
  const startWatchingPosition = useCallback(() => {
    if (!navigator.geolocation) return;
    
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setGpsError(null);
      },
      (error) => {
        // Don't show error for timeout in watch mode, just keep trying
        if (error.code !== error.TIMEOUT) {
          setGpsError("GPS signal lost. Please ensure location is enabled.");
        }
      },
      {
        enableHighAccuracy: false, // Use network for continuous tracking (more reliable)
        timeout: 60000, // 60 seconds
        maximumAge: 30000 // Accept 30 seconds old position
      }
    );
    setWatchId(id);
  }, []);

  // Stop watching position
  const stopWatchingPosition = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // ==================== ANTI-CHEAT MEASURES ====================
  
  // 1. Load saved/recovered journey from localStorage on mount
  useEffect(() => {
    const savedJourney = localStorage.getItem('activeJourney');
    if (savedJourney) {
      const journey = JSON.parse(savedJourney);
      // Check if journey is from a previous session (page was closed)
      const lastActivity = new Date(journey.lastActivity || journey.startTime);
      const now = new Date();
      const minutesSinceActivity = (now - lastActivity) / (1000 * 60);
      
      if (minutesSinceActivity > 2) {
        // Journey was interrupted - show recovery modal
        setRecoveredJourney({
          ...journey,
          minutesSinceActivity: Math.round(minutesSinceActivity)
        });
        setShowRecoveryModal(true);
      } else {
        // Continue journey normally
        resumeJourney(journey);
      }
    }
  }, []);

  // Resume a journey from saved state
  const resumeJourney = (journey) => {
    setJourneyId(journey.journeyId);
    setSelectedDriver(journey.driver);
    setStartTime(journey.startTime);
    setStops(journey.stops || []);
    setTotalDistance(journey.totalDistance || 0);
    setGpsLostCount(journey.gpsLostCount || 0);
    setJourneyState("active");
    startWatchingPosition();
    toast.info("🔄 Journey resumed");
  };

  // Handle recovered journey (user choice)
  const handleRecoveryChoice = async (choice) => {
    setShowRecoveryModal(false);
    
    if (choice === 'continue') {
      // Add a "RECOVERED" stop to mark the gap
      const now = new Date();
      const recoveryStop = {
        id: (recoveredJourney.stops?.length || 0) + 1,
        type: "RECOVERED",
        lat: currentLocation?.lat || recoveredJourney.stops?.[recoveredJourney.stops.length - 1]?.lat || 0,
        lng: currentLocation?.lng || recoveredJourney.stops?.[recoveredJourney.stops.length - 1]?.lng || 0,
        address: `⚠️ GAP: Session closed for ${recoveredJourney.minutesSinceActivity} min`,
        timestamp: now.toISOString(),
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('en-IN'),
        kmFromStart: recoveredJourney.totalDistance || 0,
        kmFromPrev: 0,
        wasRecovered: true
      };
      
      resumeJourney({
        ...recoveredJourney,
        stops: [...(recoveredJourney.stops || []), recoveryStop]
      });
    } else {
      // Discard journey
      localStorage.removeItem('activeJourney');
      setRecoveredJourney(null);
      toast.warning("Incomplete journey discarded");
    }
  };

  // 2. Save journey to localStorage FREQUENTLY (every state change)
  useEffect(() => {
    if (journeyState === "active" && journeyId) {
      const journeyData = {
        journeyId,
        driver: selectedDriver,
        startTime,
        stops,
        totalDistance,
        gpsLostCount,
        lastActivity: new Date().toISOString() // Track last activity time
      };
      localStorage.setItem('activeJourney', JSON.stringify(journeyData));
    }
  }, [journeyState, journeyId, selectedDriver, startTime, stops, totalDistance, gpsLostCount]);

  // 3. AUTO-LOG position every 2 minutes during active journey
  useEffect(() => {
    if (journeyState === "active") {
      const interval = setInterval(async () => {
        try {
          const location = await getCurrentLocation();
          const now = new Date();
          const lastStop = stops[stops.length - 1];
          
          // Calculate distance from last stop
          let kmFromPrev = 0;
          if (lastStop) {
            kmFromPrev = calculateDistance(lastStop.lat, lastStop.lng, location.lat, location.lng);
          }
          
          // Only add auto-log if moved more than 100 meters
          if (kmFromPrev > 0.1) {
            const autoStop = {
              id: stops.length + 1,
              type: "AUTO",
              lat: location.lat,
              lng: location.lng,
              address: location.address,
              timestamp: location.timestamp,
              time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              date: now.toLocaleDateString('en-IN'),
              kmFromStart: totalDistance + kmFromPrev,
              kmFromPrev: kmFromPrev,
              isAutoLogged: true
            };
            
            setStops(prev => [...prev, autoStop]);
            setTotalDistance(prev => prev + kmFromPrev);
            setLastAutoLog(now.toISOString());
            console.log("📍 Auto-logged position:", location.address);
          }
        } catch (error) {
          console.error("Auto-log failed:", error);
          setGpsLostCount(prev => prev + 1);
        }
      }, 2 * 60 * 1000); // Every 2 minutes
      
      setAutoLogInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (autoLogInterval) {
        clearInterval(autoLogInterval);
        setAutoLogInterval(null);
      }
    }
  }, [journeyState, stops, totalDistance, getCurrentLocation]);

  // 4. WARN user when trying to close/refresh page during active journey
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (journeyState === "active") {
        const message = "⚠️ You have an active journey! If you close this page, the journey will be marked as interrupted. Are you sure?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [journeyState]);

  // 5. Track GPS lost events
  useEffect(() => {
    if (gpsError && journeyState === "active") {
      setGpsLostCount(prev => prev + 1);
    }
  }, [gpsError, journeyState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatchingPosition();
      if (autoLogInterval) {
        clearInterval(autoLogInterval);
      }
    };
  }, [stopWatchingPosition, autoLogInterval]);

  // Start Journey
  const handleStartJourney = async () => {
    if (!selectedDriver) {
      toast.error("Please select a driver/cab first");
      return;
    }

    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      const newJourneyId = generateJourneyId();
      const now = new Date();
      
      const startStop = {
        id: 1,
        type: "START",
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        timestamp: location.timestamp,
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('en-IN'),
        kmFromStart: 0,
        kmFromPrev: 0
      };

      setJourneyId(newJourneyId);
      setStartTime(now.toISOString());
      setStops([startStop]);
      setTotalDistance(0);
      setJourneyState("active");
      startWatchingPosition();
      
      toast.success("🚗 Journey Started! Drive safely.");
    } catch (error) {
      setGpsError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add Stop Point
  const handleAddStop = async (stopType = "STOP") => {
    if (journeyState !== "active") return;

    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      const now = new Date();
      const prevStop = stops[stops.length - 1];
      
      // Calculate distance from previous stop
      const kmFromPrev = calculateDistance(
        prevStop.lat, prevStop.lng,
        location.lat, location.lng
      );
      
      const newTotalDistance = totalDistance + kmFromPrev;
      
      const newStop = {
        id: stops.length + 1,
        type: stopType,
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        timestamp: location.timestamp,
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('en-IN'),
        kmFromStart: newTotalDistance,
        kmFromPrev: kmFromPrev
      };

      setStops(prev => [...prev, newStop]);
      setTotalDistance(newTotalDistance);
      
      toast.success(`📍 ${stopType} point added! (${kmFromPrev.toFixed(2)} km)`);
    } catch (error) {
      setGpsError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // End Journey
  const handleEndJourney = async () => {
    if (journeyState !== "active") return;

    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      const now = new Date();
      const prevStop = stops[stops.length - 1];
      
      const kmFromPrev = calculateDistance(
        prevStop.lat, prevStop.lng,
        location.lat, location.lng
      );
      
      const finalTotalDistance = totalDistance + kmFromPrev;
      
      const endStop = {
        id: stops.length + 1,
        type: "END",
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        timestamp: location.timestamp,
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('en-IN'),
        kmFromStart: finalTotalDistance,
        kmFromPrev: kmFromPrev
      };

      const finalStops = [...stops, endStop];
      
      // Submit to Google Sheets
      await submitJourneyToSheet(finalStops, finalTotalDistance);
      
      // Clear state
      setJourneyState("idle");
      setJourneyId("");
      setStartTime(null);
      setStops([]);
      setTotalDistance(0);
      setSelectedDriver(null);
      stopWatchingPosition();
      localStorage.removeItem('activeJourney');
      
      toast.success(`✅ Journey Completed! Total: ${finalTotalDistance.toFixed(2)} km`);
    } catch (error) {
      setGpsError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Journey to Google Sheets
  const submitJourneyToSheet = async (finalStops, finalDistance) => {
    const formData = new FormData();
    
    // Main journey data
    formData.append('JOURNEYID', journeyId);
    formData.append('DRIVERNAME', selectedDriver.driverName);
    formData.append('DRIVERMOBILE', selectedDriver.driverMobile);
    formData.append('CABNO', selectedDriver.cabNo);
    formData.append('VEHICLENO', selectedDriver.vehicleNo);
    formData.append('DATE', finalStops[0].date);
    formData.append('STARTTIME', finalStops[0].time);
    formData.append('ENDTIME', finalStops[finalStops.length - 1].time);
    formData.append('TOTALKM', finalDistance.toFixed(2));
    formData.append('TOTALSTOPS', finalStops.length.toString());
    
    // Start location
    formData.append('STARTLAT', finalStops[0].lat.toString());
    formData.append('STARTLNG', finalStops[0].lng.toString());
    formData.append('STARTADDRESS', finalStops[0].address);
    
    // End location
    const endStop = finalStops[finalStops.length - 1];
    formData.append('ENDLAT', endStop.lat.toString());
    formData.append('ENDLNG', endStop.lng.toString());
    formData.append('ENDADDRESS', endStop.address);
    
    // All stops as JSON
    formData.append('ALLSTOPS', JSON.stringify(finalStops));
    
    // Anti-cheat data
    const autoLogCount = finalStops.filter(s => s.isAutoLogged).length;
    const recoveryCount = finalStops.filter(s => s.wasRecovered).length;
    formData.append('AUTOLOGS', autoLogCount.toString());
    formData.append('GPSLOST', gpsLostCount.toString());
    formData.append('RECOVERED', recoveryCount.toString());
    formData.append('SUSPICIOUS', (recoveryCount > 0 || gpsLostCount > 3) ? 'YES' : 'NO');
    
    // Identifier for Google Apps Script
    formData.append('FORMTYPE', 'GPSJOURNEY');

    try {
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Failed to save journey data");
      }
    } catch (error) {
      console.error("Submit error:", error);
      // Save locally as backup
      const savedJourneys = JSON.parse(localStorage.getItem('savedJourneys') || '[]');
      savedJourneys.push({
        journeyId,
        driver: selectedDriver,
        stops: finalStops,
        totalDistance: finalDistance,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('savedJourneys', JSON.stringify(savedJourneys));
      throw error;
    }
  };

  // Format time duration
  const getJourneyDuration = () => {
    if (!startTime) return "0h 0m";
    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="gps-tracking-wrapper">
      <CommonSection title="GPS Journey Tracking" />
      
      {/* Journey Recovery Modal */}
      {showRecoveryModal && recoveredJourney && (
        <div className="recovery-modal-overlay">
          <div className="recovery-modal">
            <div className="recovery-modal-header">
              <i className="ri-alert-line"></i>
              <span>Incomplete Journey Found</span>
            </div>
            <div className="recovery-modal-body">
              <div className="recovery-info">
                <p>
                  <strong>Journey ID:</strong> {recoveredJourney.journeyId}
                </p>
                <p>
                  <strong>Driver:</strong> {recoveredJourney.driver?.driverName}
                </p>
                <p>
                  <strong>Cab:</strong> {recoveredJourney.driver?.cabNo}
                </p>
                <p>
                  <strong>Stops recorded:</strong> {recoveredJourney.stops?.length || 0}
                </p>
                <p className="warning-text">
                  ⚠️ Session was closed {recoveredJourney.minutesSinceActivity} minutes ago
                </p>
              </div>
              <div className="recovery-note">
                <i className="ri-information-line"></i>
                If you continue, a "RECOVERED" marker will be added to indicate the gap in tracking.
              </div>
            </div>
            <div className="recovery-modal-footer">
              <button 
                className="recovery-btn continue"
                onClick={() => handleRecoveryChoice('continue')}
              >
                <i className="ri-play-circle-line"></i>
                Continue Journey
              </button>
              <button 
                className="recovery-btn discard"
                onClick={() => handleRecoveryChoice('discard')}
              >
                <i className="ri-delete-bin-line"></i>
                Discard & Start New
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Container className="gps-container">
        {/* Navigation Button */}
        {!isOnJourneyHistoryPage && (
          <div className="nav-btn-wrapper">
            <button 
              className="journey-history-nav-btn"
              onClick={() => navigate('/journey-history')}
            >
              <i className="ri-history-line"></i>
              View Journey History
            </button>
          </div>
        )}

        {/* GPS Status Bar */}
        <div className={`gps-status-bar ${currentLocation ? 'connected' : 'disconnected'}`}>
          <span className="gps-icon">
            {currentLocation ? '🛰️' : '📡'}
          </span>
          <span className="gps-text">
            {currentLocation ? 'GPS Connected' : 'Waiting for GPS...'}
          </span>
          {gpsError && <span className="gps-error">{gpsError}</span>}
        </div>

        {/* Driver Selection (Only when idle) */}
        {journeyState === "idle" && (
          <div className="driver-selection-card">
            <h3 className="card-title">
              <i className="ri-user-3-line"></i>
              Select Driver & Vehicle
            </h3>
            <div className="driver-grid">
              {driversData.map(driver => (
                <div
                  key={driver.id}
                  className={`driver-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="driver-avatar">
                    <i className="ri-user-line"></i>
                  </div>
                  <div className="driver-info">
                    <span className="driver-name">{driver.driverName}</span>
                    <span className="driver-cab">{driver.cabNo} • {driver.vehicleNo}</span>
                    <span className="driver-mobile">{driver.driverMobile}</span>
                  </div>
                  {selectedDriver?.id === driver.id && (
                    <div className="selected-check">
                      <i className="ri-checkbox-circle-fill"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              className="start-journey-btn"
              onClick={handleStartJourney}
              disabled={!selectedDriver || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" /> Getting Location...
                </>
              ) : (
                <>
                  <i className="ri-play-circle-fill"></i>
                  Start Journey
                </>
              )}
            </Button>
          </div>
        )}

        {/* Active Journey Panel */}
        {journeyState === "active" && (
          <>
            {/* Journey Stats */}
            <div className="journey-stats-card">
              <div className="journey-header">
                <div className="journey-id">
                  <span className="label">Journey ID</span>
                  <span className="value">{journeyId}</span>
                </div>
                <div className={`journey-status active`}>
                  <span className="pulse"></span>
                  ACTIVE
                </div>
              </div>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <i className="ri-road-map-line"></i>
                  <div className="stat-content">
                    <span className="stat-value">{totalDistance.toFixed(2)}</span>
                    <span className="stat-label">KM Traveled</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="ri-time-line"></i>
                  <div className="stat-content">
                    <span className="stat-value">{getJourneyDuration()}</span>
                    <span className="stat-label">Duration</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="ri-map-pin-line"></i>
                  <div className="stat-content">
                    <span className="stat-value">{stops.length}</span>
                    <span className="stat-label">Stops</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="ri-car-line"></i>
                  <div className="stat-content">
                    <span className="stat-value">{selectedDriver?.cabNo}</span>
                    <span className="stat-label">{selectedDriver?.driverName}</span>
                  </div>
                </div>
              </div>
              
              {/* Anti-cheat Status */}
              <div className="anticheat-status">
                <div className="anticheat-item">
                  <i className="ri-robot-line"></i>
                  <span>Auto-logs: {stops.filter(s => s.isAutoLogged).length}</span>
                </div>
                <div className={`anticheat-item ${gpsLostCount > 0 ? 'warning' : ''}`}>
                  <i className="ri-signal-wifi-off-line"></i>
                  <span>GPS Lost: {gpsLostCount}</span>
                </div>
                {stops.some(s => s.wasRecovered) && (
                  <div className="anticheat-item warning">
                    <i className="ri-alert-line"></i>
                    <span>Recovered Session</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Button
                className="add-stop-btn pickup"
                onClick={() => handleAddStop("PICKUP")}
                disabled={isLoading}
              >
                <i className="ri-user-add-line"></i>
                Add Pickup
              </Button>
              <Button
                className="add-stop-btn drop"
                onClick={() => handleAddStop("DROP")}
                disabled={isLoading}
              >
                <i className="ri-user-minus-line"></i>
                Add Drop
              </Button>
              <Button
                className="add-stop-btn break"
                onClick={() => handleAddStop("BREAK")}
                disabled={isLoading}
              >
                <i className="ri-pause-circle-line"></i>
                Add Break
              </Button>
              <Button
                className="end-journey-btn"
                onClick={handleEndJourney}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <i className="ri-stop-circle-fill"></i>
                    End Journey
                  </>
                )}
              </Button>
            </div>

            {/* Stops Timeline */}
            <div className="stops-timeline-card">
              <h3 className="card-title">
                <i className="ri-route-line"></i>
                Journey Timeline
              </h3>
              <div className="timeline">
                {stops.map((stop, index) => (
                  <div key={stop.id} className={`timeline-item ${stop.type.toLowerCase()}`}>
                    <div className="timeline-marker">
                      <span className="marker-number">{index + 1}</span>
                    </div>
                    <div className="timeline-content">
                      <div className="stop-header">
                        <span className={`stop-type ${stop.type.toLowerCase()}`}>
                          {stop.type === "START" && <i className="ri-play-fill"></i>}
                          {stop.type === "PICKUP" && <i className="ri-user-add-fill"></i>}
                          {stop.type === "DROP" && <i className="ri-user-minus-fill"></i>}
                          {stop.type === "BREAK" && <i className="ri-pause-fill"></i>}
                          {stop.type === "END" && <i className="ri-stop-fill"></i>}
                          {stop.type}
                        </span>
                        <span className="stop-time">{stop.time}</span>
                      </div>
                      <div className="stop-address">
                        <i className="ri-map-pin-2-line"></i>
                        {stop.address}
                      </div>
                      <div className="stop-meta">
                        <span className="km-badge">
                          <i className="ri-road-map-line"></i>
                          {stop.kmFromStart.toFixed(2)} km total
                        </span>
                        {stop.kmFromPrev > 0 && (
                          <span className="km-diff">
                            +{stop.kmFromPrev.toFixed(2)} km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Info Box */}
        {journeyState === "idle" && (
          <div className="info-box">
            <h4><i className="ri-information-line"></i> How to Use</h4>
            <ul>
              <li><i className="ri-checkbox-circle-line"></i> Select your Driver/Cab from the list above</li>
              <li><i className="ri-checkbox-circle-line"></i> Click "Start Journey" when you begin driving</li>
              <li><i className="ri-checkbox-circle-line"></i> Add "Pickup" or "Drop" points at each stop</li>
              <li><i className="ri-checkbox-circle-line"></i> Click "End Journey" when you're done</li>
              <li><i className="ri-checkbox-circle-line"></i> All data is automatically saved with GPS coordinates</li>
            </ul>
          </div>
        )}
      </Container>
    </div>
  );
};

export default GPSTracking;
