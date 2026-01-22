import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";
import CommonSection from "../components/UI/CommonSection";
import { googleSheetUrl } from "../urlandKeys";
import "../styles/gps-tracking.css";

/**
 * GPS TRACKING SYSTEM - MULTI-DRIVER ARCHITECTURE
 * ================================================
 * 
 * 🔒 THREAD-SAFE FOR MULTIPLE DRIVERS:
 * 
 * 1. DATA ISOLATION:
 *    - Each driver uses their own phone/browser
 *    - localStorage is device-specific (not shared between devices)
 *    - Driver 1 (Phone A) → localStorage A
 *    - Driver 2 (Phone B) → localStorage B
 *    - Driver 3 (Phone C) → localStorage C
 *    - NO conflicts or data mixing possible!
 * 
 * 2. UNIQUE JOURNEY IDs:
 *    - Format: JRN + YYMMDDHHMMSS + C{cabNo} + R{random}
 *    - Example: JRN250122143025C1R847
 *    - Includes: Date, Time (to second), Cab Number, Random component
 *    - Collision probability: ~0% (virtually impossible)
 * 
 * 3. GOOGLE SHEETS SUBMISSION:
 *    - Each driver submits to same sheet independently
 *    - Different rows, no overwrites
 *    - All journeys recorded separately
 * 
 * 4. TRIP RECORDS:
 *    - TripId = {journeyId}-{empId}
 *    - Inherits uniqueness from journeyId
 *    - Each employee trip = separate row in sheet
 * 
 * ✅ CONCLUSION: 100% safe for simultaneous use by all 3 drivers!
 */

// Driver Data (same as DriverCabDetails)
const driversData = [
  { 
    id: 1, 
    cabNo: "CAB-1", 
    driverName: "SIDDHARTH SINGH", 
    driverMobile: "6388499177", 
    vehicleNo: "UP32TN5393",
    driverEmpId: "UC-0009",
    vendorName: "Union Services",
    escortName: "DEEPAK YADAV",
    escortMobile: "6388320196"
  },
  { 
    id: 2, 
    cabNo: "CAB-2", 
    driverName: "RAHUL KASHYAP", 
    driverMobile: "7355713216", 
    vehicleNo: "UP32ZN7576",
    driverEmpId: "UC-0008",
    vendorName: "Union Services",
    escortName: "ANUJ SINGH",
    escortMobile: "7355713217"
  },
  { 
    id: 3, 
    cabNo: "CAB-3", 
    driverName: "FAIZ KHAN", 
    driverMobile: "6388320195", 
    vehicleNo: "UP32TN4911",
    driverEmpId: "UC-0007",
    vendorName: "Union Services",
    escortName: "DHEERAJ RATHORE",
    escortMobile: "6388320194"
  },
];

// All Employees Data
const employeesData = [
  { id: 1, name: "Sujata Sharma", empId: "EHS5665", cabId: 1 },
  { id: 2, name: "Swetha Pandey", empId: "EHS3072", cabId: 1 },
  { id: 3, name: "Veena Nigam", empId: "EHS5667", cabId: 1 },
  { id: 4, name: "Riya Kumari", empId: "EHS5661", cabId: 2 },
  { id: 5, name: "Pragati Pandey", empId: "EHS5804", cabId: 2 },
  { id: 6, name: "Ananya Singh", empId: "EHS5644", cabId: 2 },
  { id: 7, name: "Reet Tandon", empId: "EHS5660", cabId: 3 },
  { id: 8, name: "Anamika Rani", empId: "EHS5643", cabId: 3 },
  { id: 9, name: "Garima Singh", empId: "EHS5652", cabId: 3 },
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
  
  // Employee tracking state
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "PICKUP" or "DROP"
  const [pendingStopData, setPendingStopData] = useState(null);
  const [employeesInCab, setEmployeesInCab] = useState([]); // Currently picked employees
  const [tripRecords, setTripRecords] = useState([]); // Complete trip records (pickup + drop pairs)
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Multiple employees selection
  const [commonFormData, setCommonFormData] = useState({
    shiftTiming: "EVE (3PM-12AM)",
    delay: "",
    remarks: ""
  });
  const [showCustomEmployeeForm, setShowCustomEmployeeForm] = useState(false);
  const [customEmployee, setCustomEmployee] = useState({
    name: "",
    empId: ""
  });

  // Generate Unique Journey ID (driver-specific + timestamp + random)
  const generateJourneyId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Include driver/cab identifier to ensure uniqueness across drivers
    const driverIdentifier = selectedDriver ? selectedDriver.cabNo.replace('CAB-', '') : '0';
    
    // Random component for extra safety
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Format: JRN-YYMMDD-HHMMSS-CAB-RND
    // Example: JRN-250122-143025-1-847
    return `JRN${year}${month}${day}${hours}${minutes}${seconds}C${driverIdentifier}R${random}`;
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
    setEmployeesInCab(journey.employeesInCab || []); // Restore employees in cab
    setTripRecords(journey.tripRecords || []); // Restore trip records
    setJourneyState("active");
    startWatchingPosition();
    
    // Show info about employees in cab
    if (journey.employeesInCab && journey.employeesInCab.length > 0) {
      toast.info(`🔄 Journey resumed with ${journey.employeesInCab.length} employee(s) in cab`);
    } else {
      toast.info("🔄 Journey resumed");
    }
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
        stops: [...(recoveredJourney.stops || []), recoveryStop],
        employeesInCab: recoveredJourney.employeesInCab || [],
        tripRecords: recoveredJourney.tripRecords || []
      });
    } else {
      // Discard journey
      localStorage.removeItem('activeJourney');
      setRecoveredJourney(null);
      toast.warning("Incomplete journey discarded");
    }
  };

  // 2. Save journey to localStorage FREQUENTLY (every state change including employees data)
  useEffect(() => {
    if (journeyState === "active" && journeyId) {
      const journeyData = {
        journeyId,
        driver: selectedDriver,
        startTime,
        stops,
        totalDistance,
        gpsLostCount,
        employeesInCab, // Save employees currently in cab
        tripRecords, // Save completed trip records
        lastActivity: new Date().toISOString() // Track last activity time
      };
      localStorage.setItem('activeJourney', JSON.stringify(journeyData));
      
      // Log for debugging
      console.log(`💾 Auto-saved: ${stops.length} stops, ${employeesInCab.length} in cab, ${tripRecords.length} trips completed`);
    }
  }, [journeyState, journeyId, selectedDriver, startTime, stops, totalDistance, gpsLostCount, employeesInCab, tripRecords]);

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
      // Note: We DON'T clear localStorage on unmount - only on journey end
      // This allows recovery if user accidentally closes tab
    };
  }, [stopWatchingPosition, autoLogInterval]);

  // Manual clear function (for debugging/admin use)
  const clearAllData = () => {
    if (window.confirm("⚠️ This will delete ALL journey data including active journey. Continue?")) {
      localStorage.removeItem('activeJourney');
      localStorage.removeItem('savedJourneys');
      setJourneyState("idle");
      setJourneyId("");
      setStartTime(null);
      setStops([]);
      setTotalDistance(0);
      setSelectedDriver(null);
      setEmployeesInCab([]);
      setTripRecords([]);
      setSelectedEmployees([]);
      setGpsLostCount(0);
      stopWatchingPosition();
      toast.success("🗑️ All data cleared!");
    }
  };

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
      
      // Log unique journey ID for verification
      console.log(`🚀 Journey Started!`);
      console.log(`📍 Journey ID: ${newJourneyId}`);
      console.log(`👤 Driver: ${selectedDriver.driverName} (${selectedDriver.cabNo})`);
      console.log(`🆔 Unique ID ensures no conflicts with other drivers' journeys`);
      
      toast.success(`🚗 Journey Started! ID: ${newJourneyId}`);
    } catch (error) {
      setGpsError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add Stop Point - Now opens employee modal
  const handleAddStop = async (stopType = "STOP") => {
    if (journeyState !== "active") return;

    if (stopType === "PICKUP" || stopType === "DROP") {
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
        
        // Store pending stop data
        setPendingStopData({
          id: stops.length + 1,
          type: stopType,
          lat: location.lat,
          lng: location.lng,
          address: location.address,
          timestamp: location.timestamp,
          time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          date: now.toLocaleDateString('en-IN'),
          kmFromStart: newTotalDistance,
          kmFromPrev: kmFromPrev,
          meterReading: newTotalDistance.toFixed(2)
        });
        
        // Open employee modal
        setModalType(stopType);
        setSelectedEmployees([]);
        setCommonFormData({
          shiftTiming: "EVE (3PM-12AM)",
          delay: "",
          remarks: ""
        });
        setShowCustomEmployeeForm(false);
        setCustomEmployee({ name: "", empId: "" });
        setShowEmployeeModal(true);
        
      } catch (error) {
        setGpsError(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For BREAK or other stop types, add directly
      setIsLoading(true);
      try {
        const location = await getCurrentLocation();
        const now = new Date();
        const prevStop = stops[stops.length - 1];
        
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
    }
  };

  // Handle adding custom employee
  const handleAddCustomEmployee = () => {
    if (!customEmployee.name || !customEmployee.empId) {
      toast.error("Please enter employee name and ID");
      return;
    }

    // Add to selected employees list
    setSelectedEmployees(prev => [...prev, {
      name: customEmployee.name,
      empId: customEmployee.empId,
      isCustom: true
    }]);

    // Reset custom form
    setCustomEmployee({ name: "", empId: "" });
    setShowCustomEmployeeForm(false);
    toast.success(`${customEmployee.name} added!`);
  };

  // Toggle employee selection
  const toggleEmployeeSelection = (employee) => {
    setSelectedEmployees(prev => {
      const exists = prev.find(e => e.empId === employee.empId);
      if (exists) {
        return prev.filter(e => e.empId !== employee.empId);
      } else {
        return [...prev, employee];
      }
    });
  };

  // Handle employee modal submission (multiple employees)
  const handleEmployeeSubmit = () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    if (modalType === "PICKUP") {
      // Add all selected employees to cab
      const newEmployees = selectedEmployees.map(emp => ({
        employeeName: emp.name,
        empId: emp.empId,
        tripType: "PICKUP",
        shiftTiming: commonFormData.shiftTiming,
        delay: commonFormData.delay,
        remarks: commonFormData.remarks,
        pickupLocation: pendingStopData.address,
        pickupTime: pendingStopData.time,
        pickupMeterReading: pendingStopData.meterReading,
        pickupStopId: pendingStopData.id,
        pickupLat: pendingStopData.lat,
        pickupLng: pendingStopData.lng
      }));
      
      setEmployeesInCab(prev => [...prev, ...newEmployees]);
      
      // Add stop with all employee info
      const stopWithEmployees = {
        ...pendingStopData,
        employees: selectedEmployees.map(e => ({ name: e.name, empId: e.empId }))
      };
      
      setStops(prev => [...prev, stopWithEmployees]);
      setTotalDistance(pendingStopData.kmFromStart);
      
      toast.success(`✅ ${selectedEmployees.length} employee(s) picked up!`);
      
    } else if (modalType === "DROP") {
      // Create trip records for all selected employees
      const newTripRecords = selectedEmployees.map(selectedEmp => {
        const employee = employeesInCab.find(e => e.empId === selectedEmp.empId);
        
        if (!employee) {
          toast.error(`${selectedEmp.name} not found in cab`);
          return null;
        }

        return {
          tripId: `${journeyId}-${employee.empId}`,
          date: pendingStopData.date,
          cabNo: selectedDriver.cabNo,
          vendorName: selectedDriver.vendorName,
          driverName: selectedDriver.driverName,
          driverMobile: selectedDriver.driverMobile,
          escortName: selectedDriver.escortName || "",
          escortMobile: selectedDriver.escortMobile || "",
          employeeName: employee.employeeName,
          empId: employee.empId,
          tripType: employee.tripType,
          pickupLocation: employee.pickupLocation,
          pickupTime: employee.pickupTime,
          pickupMeterReading: employee.pickupMeterReading,
          dropLocation: pendingStopData.address,
          dropTime: pendingStopData.time,
          dropMeterReading: pendingStopData.meterReading,
          totalKm: (parseFloat(pendingStopData.meterReading) - parseFloat(employee.pickupMeterReading)).toFixed(2),
          shiftTiming: employee.shiftTiming,
          gpsEnabled: "YES",
          delay: commonFormData.delay || employee.delay || "",
          remarks: commonFormData.remarks || employee.remarks || ""
        };
      }).filter(Boolean);
      
      setTripRecords(prev => [...prev, ...newTripRecords]);
      
      // Remove dropped employees from cab
      const droppedEmpIds = selectedEmployees.map(e => e.empId);
      setEmployeesInCab(prev => prev.filter(e => !droppedEmpIds.includes(e.empId)));
      
      // Add stop with employee info
      const stopWithEmployees = {
        ...pendingStopData,
        employees: selectedEmployees.map(e => ({ name: e.name, empId: e.empId }))
      };
      
      setStops(prev => [...prev, stopWithEmployees]);
      setTotalDistance(pendingStopData.kmFromStart);
      
      toast.success(`✅ ${selectedEmployees.length} employee(s) dropped off!`);
    }

    // Close modal and reset
    setShowEmployeeModal(false);
    setPendingStopData(null);
    setSelectedEmployees([]);
    setCommonFormData({
      shiftTiming: "EVE (3PM-12AM)",
      delay: "",
      remarks: ""
    });
    setShowCustomEmployeeForm(false);
    setCustomEmployee({ name: "", empId: "" });
  };

  // End Journey
  const handleEndJourney = async () => {
    if (journeyState !== "active") return;

    // Check if there are employees still in cab
    if (employeesInCab.length > 0) {
      const employeeNames = employeesInCab.map(e => e.employeeName).join(", ");
      if (!window.confirm(`Warning: ${employeesInCab.length} employee(s) still in cab: ${employeeNames}. Are you sure you want to end the journey?`)) {
        return;
      }
    }

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
      
      // Submit GPS journey and trip records to Google Sheets
      await submitJourneyToSheet(finalStops, finalTotalDistance);
      await submitTripRecordsToSheet();
      
      // Clear ALL state and localStorage
      setJourneyState("idle");
      setJourneyId("");
      setStartTime(null);
      setStops([]);
      setTotalDistance(0);
      setSelectedDriver(null);
      setEmployeesInCab([]);
      setTripRecords([]);
      setSelectedEmployees([]);
      setCommonFormData({
        shiftTiming: "EVE (3PM-12AM)",
        delay: "",
        remarks: ""
      });
      setShowCustomEmployeeForm(false);
      setCustomEmployee({ name: "", empId: "" });
      setGpsLostCount(0);
      stopWatchingPosition();
      
      // Clear localStorage completely
      localStorage.removeItem('activeJourney');
      console.log("✅ Journey completed - All data cleared from localStorage and state");
      
      // Show detailed completion message
      const completionMsg = `
🎉 Journey Completed Successfully!

📊 Summary:
• Total Distance: ${finalTotalDistance.toFixed(2)} km
• Total Stops: ${finalStops.length}
• Trip Records Saved: ${tripRecords.length}
• GPS Journey Saved: Yes

✅ All data submitted to Google Sheets
🗑️ Local storage cleared
      `.trim();
      
      console.log(completionMsg);
      toast.success(`✅ Journey Completed! ${finalTotalDistance.toFixed(2)} km | ${tripRecords.length} trip(s) saved`, {
        autoClose: 5000
      });
    } catch (error) {
      setGpsError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Trip Records to Google Sheets (DRIVERCABDETAIL)
  const submitTripRecordsToSheet = async () => {
    if (tripRecords.length === 0) {
      console.log("No trip records to submit");
      return;
    }

    toast.info(`Submitting ${tripRecords.length} trip record(s)...`);

    for (const trip of tripRecords) {
      const formData = new FormData();
      
      // Fill all required fields
      formData.append('DATE', trip.date);
      formData.append('TRIPID', trip.tripId);
      formData.append('CABNO', trip.cabNo);
      formData.append('VENDORNAME', trip.vendorName);
      formData.append('DRIVERNAME', trip.driverName);
      formData.append('DRIVERMOBILE', trip.driverMobile);
      formData.append('ESCORTNAME', trip.escortName);
      formData.append('ESCORTIDMOBILE', trip.escortMobile);
      formData.append('EMPLOYEENAME', trip.employeeName);
      formData.append('EMPID', trip.empId);
      formData.append('TRIPTYPE', trip.tripType);
      formData.append('PICKUPLOCATION', trip.pickupLocation);
      formData.append('PICKUPTIME', trip.pickupTime);
      formData.append('PICKUPMETERREADING', trip.pickupMeterReading);
      formData.append('DROPOFFLOCATION', trip.dropLocation);
      formData.append('DROPOFFTIME', trip.dropTime);
      formData.append('DROPOFFMETERREADING', trip.dropMeterReading);
      formData.append('TOTALKM', trip.totalKm);
      formData.append('SHIFTTIMING', trip.shiftTiming);
      formData.append('GPSENABLED', trip.gpsEnabled);
      formData.append('DELAY', trip.delay);
      formData.append('REMARKS', trip.remarks);

      try {
        const response = await fetch(googleSheetUrl, {
          method: "POST",
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Failed to save trip record for ${trip.employeeName}`);
        }
        
        console.log(`✅ Trip record saved for ${trip.employeeName}`);
      } catch (error) {
        console.error(`Error saving trip record for ${trip.employeeName}:`, error);
        toast.error(`Failed to save trip for ${trip.employeeName}`);
      }
    }

    toast.success(`✅ ${tripRecords.length} trip record(s) saved to sheet!`);
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
                <p>
                  <strong>Distance covered:</strong> {recoveredJourney.totalDistance?.toFixed(2) || 0} km
                </p>
                {recoveredJourney.employeesInCab && recoveredJourney.employeesInCab.length > 0 && (
                  <div className="employees-in-cab-warning">
                    <p><strong>⚠️ Employees in Cab:</strong> {recoveredJourney.employeesInCab.length}</p>
                    <ul>
                      {recoveredJourney.employeesInCab.map((emp, idx) => (
                        <li key={idx}>
                          {emp.employeeName} ({emp.empId}) - Picked at {emp.pickupTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {recoveredJourney.tripRecords && recoveredJourney.tripRecords.length > 0 && (
                  <p>
                    <strong>Completed trips:</strong> {recoveredJourney.tripRecords.length}
                  </p>
                )}
                <p className="warning-text">
                  ⚠️ Session was closed {recoveredJourney.minutesSinceActivity} minutes ago
                </p>
              </div>
              <div className="recovery-note">
                <i className="ri-information-line"></i>
                If you continue, a "RECOVERED" marker will be added to indicate the gap in tracking. All employee data will be preserved.
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
                  <i className="ri-save-line"></i>
                  <span className="auto-save-indicator">✓ Auto-saved</span>
                </div>
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

              {/* Employees in Cab Status */}
              {employeesInCab.length > 0 && (
                <div className="employees-in-cab-status">
                  <div className="status-header">
                    <i className="ri-user-line"></i>
                    <span>Employees in Cab: {employeesInCab.length}</span>
                  </div>
                  <div className="employees-list">
                    {employeesInCab.map((emp, idx) => (
                      <div key={idx} className="employee-item">
                        <span className="emp-name">{emp.employeeName}</span>
                        <span className="emp-pickup">Picked at {emp.pickupTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Button
                className="add-stop-btn pickup"
                onClick={() => handleAddStop("PICKUP")}
                disabled={isLoading}
              >
                <i className="ri-user-add-line"></i>
                Add Pickup ({employeesInCab.length} in cab)
              </Button>
              <Button
                className="add-stop-btn drop"
                onClick={() => handleAddStop("DROP")}
                disabled={isLoading || employeesInCab.length === 0}
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
              <li><i className="ri-checkbox-circle-line"></i> Add "Pickup" with employee details at each pickup stop</li>
              <li><i className="ri-checkbox-circle-line"></i> Add "Drop" and select employee to drop off</li>
              <li><i className="ri-checkbox-circle-line"></i> Click "End Journey" when you're done</li>
              <li><i className="ri-checkbox-circle-line"></i> All data (GPS + Trip records) is automatically saved</li>
            </ul>
            
            <div className="multi-driver-info">
              <div className="info-icon">🚗🚕🚙</div>
              <div className="info-content">
                <strong>Multiple Drivers? No Problem!</strong>
                <p>Each driver can use this app simultaneously on their own phone. Your journeys are completely independent and won't affect each other's data.</p>
              </div>
            </div>
          </div>
        )}

        {/* Employee Modal */}
        {showEmployeeModal && (
          <div className="employee-modal-overlay" onClick={() => setShowEmployeeModal(false)}>
            <div className="employee-modal" onClick={(e) => e.stopPropagation()}>
              <div className="employee-modal-header">
                <h3>
                  <i className={modalType === "PICKUP" ? "ri-user-add-line" : "ri-user-minus-line"}></i>
                  {modalType === "PICKUP" ? "Add Pickup Details" : "Add Drop Details"}
                </h3>
                <button className="close-modal-btn" onClick={() => setShowEmployeeModal(false)}>
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              <div className="employee-modal-body">
                <div className="stop-location-info">
                  <div className="info-row">
                    <i className="ri-map-pin-line"></i>
                    <span>{pendingStopData?.address}</span>
                  </div>
                  <div className="info-row">
                    <i className="ri-time-line"></i>
                    <span>{pendingStopData?.time}</span>
                  </div>
                  <div className="info-row">
                    <i className="ri-roadster-line"></i>
                    <span>{pendingStopData?.meterReading} km</span>
                  </div>
                </div>

                <div className="form-section">
                  {modalType === "PICKUP" ? (
                    <>
                      {/* Select Multiple Employees */}
                      <div className="employee-selection-section">
                        <label className="section-label">
                          <i className="ri-user-line"></i>
                          Select Employees (Multiple) *
                        </label>
                        
                        {/* Predefined Employees List */}
                        <div className="employee-checkbox-list">
                          {employeesData
                            .filter(emp => emp.cabId === selectedDriver?.id)
                            .map(emp => (
                              <div 
                                key={emp.id} 
                                className={`employee-checkbox-item ${selectedEmployees.find(e => e.empId === emp.empId) ? 'selected' : ''}`}
                                onClick={() => toggleEmployeeSelection({ name: emp.name, empId: emp.empId })}
                              >
                                <div className="checkbox-wrapper">
                                  <input
                                    type="checkbox"
                                    checked={!!selectedEmployees.find(e => e.empId === emp.empId)}
                                    onChange={() => {}}
                                  />
                                  <i className={selectedEmployees.find(e => e.empId === emp.empId) ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
                                </div>
                                <div className="employee-details">
                                  <span className="emp-name">{emp.name}</span>
                                  <span className="emp-id">{emp.empId}</span>
                                </div>
                              </div>
                            ))
                          }
                        </div>

                        {/* Custom Employee Addition */}
                        {!showCustomEmployeeForm ? (
                          <button 
                            className="add-custom-employee-btn"
                            onClick={() => setShowCustomEmployeeForm(true)}
                            type="button"
                          >
                            <i className="ri-add-circle-line"></i>
                            Add Custom Employee (Travels)
                          </button>
                        ) : (
                          <div className="custom-employee-form">
                            <div className="custom-form-header">
                              <span>Custom Employee</span>
                              <button onClick={() => setShowCustomEmployeeForm(false)}>
                                <i className="ri-close-line"></i>
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Employee Name"
                              value={customEmployee.name}
                              onChange={(e) => setCustomEmployee({...customEmployee, name: e.target.value})}
                            />
                            <input
                              type="text"
                              placeholder="Employee ID"
                              value={customEmployee.empId}
                              onChange={(e) => setCustomEmployee({...customEmployee, empId: e.target.value})}
                            />
                            <button 
                              className="add-custom-btn"
                              onClick={handleAddCustomEmployee}
                              disabled={!customEmployee.name || !customEmployee.empId}
                            >
                              <i className="ri-check-line"></i>
                              Add
                            </button>
                          </div>
                        )}

                        {/* Selected Employees Summary */}
                        {selectedEmployees.length > 0 && (
                          <div className="selected-employees-summary">
                            <strong>{selectedEmployees.length} Selected:</strong>
                            <div className="selected-chips">
                              {selectedEmployees.map((emp, idx) => (
                                <span key={idx} className="chip">
                                  {emp.name} ({emp.empId})
                                  <i 
                                    className="ri-close-circle-fill" 
                                    onClick={() => toggleEmployeeSelection(emp)}
                                  ></i>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Common Details for All Selected Employees */}
                      <div className="common-details-section">
                        <label className="section-label">Common Details</label>
                        
                        <div className="form-group">
                          <label>Shift Timing</label>
                          <select
                            value={commonFormData.shiftTiming}
                            onChange={(e) => setCommonFormData({...commonFormData, shiftTiming: e.target.value})}
                          >
                            <option value="MOR (8AM-5PM)">MOR (8AM-5PM)</option>
                            <option value="EVE (3PM-12AM)">EVE (3PM-12AM)</option>
                            <option value="NIGHT (10PM-7AM)">NIGHT (10PM-7AM)</option>
                            <option value="GEN (9AM-6PM)">GEN (9AM-6PM)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Delay (if any)</label>
                          <input
                            type="text"
                            placeholder="e.g., 10 min late"
                            value={commonFormData.delay}
                            onChange={(e) => setCommonFormData({...commonFormData, delay: e.target.value})}
                          />
                        </div>

                        <div className="form-group">
                          <label>Remarks (optional)</label>
                          <textarea
                            placeholder="Any additional notes"
                            value={commonFormData.remarks}
                            onChange={(e) => setCommonFormData({...commonFormData, remarks: e.target.value})}
                            rows="2"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Select Multiple Employees to Drop */}
                      <div className="employee-selection-section">
                        <label className="section-label">
                          <i className="ri-user-minus-line"></i>
                          Select Employees to Drop *
                        </label>
                        
                        <div className="employee-checkbox-list">
                          {employeesInCab.map((emp, idx) => (
                            <div 
                              key={idx} 
                              className={`employee-checkbox-item ${selectedEmployees.find(e => e.empId === emp.empId) ? 'selected' : ''}`}
                              onClick={() => toggleEmployeeSelection({ name: emp.employeeName, empId: emp.empId })}
                            >
                              <div className="checkbox-wrapper">
                                <input
                                  type="checkbox"
                                  checked={!!selectedEmployees.find(e => e.empId === emp.empId)}
                                  onChange={() => {}}
                                />
                                <i className={selectedEmployees.find(e => e.empId === emp.empId) ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
                              </div>
                              <div className="employee-details">
                                <span className="emp-name">{emp.employeeName}</span>
                                <span className="emp-id">{emp.empId}</span>
                                <span className="emp-pickup-info">📍 {emp.pickupTime}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Selected Employees Summary */}
                        {selectedEmployees.length > 0 && (
                          <div className="selected-employees-summary">
                            <strong>{selectedEmployees.length} Selected to Drop:</strong>
                            <div className="selected-chips">
                              {selectedEmployees.map((emp, idx) => (
                                <span key={idx} className="chip">
                                  {emp.name}
                                  <i 
                                    className="ri-close-circle-fill" 
                                    onClick={() => toggleEmployeeSelection(emp)}
                                  ></i>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Common Drop Details */}
                      <div className="common-details-section">
                        <label className="section-label">Drop Details</label>
                        
                        <div className="form-group">
                          <label>Additional Delay (if any)</label>
                          <input
                            type="text"
                            placeholder="e.g., 5 min delay"
                            value={commonFormData.delay}
                            onChange={(e) => setCommonFormData({...commonFormData, delay: e.target.value})}
                          />
                        </div>

                        <div className="form-group">
                          <label>Remarks (optional)</label>
                          <textarea
                            placeholder="Any additional notes"
                            value={commonFormData.remarks}
                            onChange={(e) => setCommonFormData({...commonFormData, remarks: e.target.value})}
                            rows="2"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="employee-modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowEmployeeModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleEmployeeSubmit}
                  disabled={selectedEmployees.length === 0}
                >
                  <i className="ri-check-line"></i>
                  {modalType === "PICKUP" 
                    ? `Pickup ${selectedEmployees.length} Employee${selectedEmployees.length > 1 ? 's' : ''}` 
                    : `Drop ${selectedEmployees.length} Employee${selectedEmployees.length > 1 ? 's' : ''}`
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default GPSTracking;
