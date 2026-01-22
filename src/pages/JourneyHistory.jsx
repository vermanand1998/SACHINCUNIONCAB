import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Spinner } from "reactstrap";
import { toast } from 'react-toastify';
import { useNavigate, useLocation, Link } from "react-router-dom";
import CommonSection from "../components/UI/CommonSection";
import { googleSheetUrl } from "../urlandKeys";
import "../styles/journey-history.css";

const JourneyHistory = () => {
  const [journeys, setJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnGPSPage = location.pathname === '/gps-tracking';

  // Fetch journeys from Google Sheets
  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    setIsLoading(true);
    try {
      // Use FormData to avoid CORS issues with Google Apps Script
      const formData = new FormData();
      formData.append('key', 'G'); // G for GPS journeys
      
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          // Parse ALLSTOPS JSON string for each journey
          const parsedJourneys = data.data.map(journey => ({
            ...journey,
            stops: journey.ALLSTOPS ? JSON.parse(journey.ALLSTOPS) : []
          }));
          setJourneys(parsedJourneys);
        }
      }
    } catch (error) {
      console.error("Error fetching journeys:", error);
      // Load from localStorage as fallback
      const savedJourneys = JSON.parse(localStorage.getItem('savedJourneys') || '[]');
      if (savedJourneys.length > 0) {
        setJourneys(savedJourneys.map(j => ({
          JOURNEYID: j.journeyId,
          DRIVERNAME: j.driver?.driverName || 'Unknown',
          CABNO: j.driver?.cabNo || 'N/A',
          VEHICLENO: j.driver?.vehicleNo || 'N/A',
          DATE: j.stops?.[0]?.date || 'N/A',
          STARTTIME: j.stops?.[0]?.time || 'N/A',
          ENDTIME: j.stops?.[j.stops.length - 1]?.time || 'N/A',
          TOTALKM: j.totalDistance?.toFixed(2) || '0',
          TOTALSTOPS: j.stops?.length || 0,
          STARTADDRESS: j.stops?.[0]?.address || 'N/A',
          ENDADDRESS: j.stops?.[j.stops.length - 1]?.address || 'N/A',
          stops: j.stops || []
        })));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Leaflet Map (Free, no API key needed)
  useEffect(() => {
    if (!selectedJourney || !mapRef.current) return;

    // Load Leaflet CSS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS dynamically
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        if (window.L) {
          resolve(window.L);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve(window.L);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    loadLeaflet().then(L => {
      // Clear existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const stops = selectedJourney.stops || [];
      if (stops.length === 0) return;

      // Initialize map centered on first stop
      const map = L.map(mapRef.current).setView([stops[0].lat, stops[0].lng], 13);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles (Free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Custom icons
      const createIcon = (color, number) => {
        return L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background: ${color};
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          ">${number}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
      };

      // Color mapping for stop types
      const colors = {
        START: '#10b981',
        PICKUP: '#3b82f6',
        DROP: '#8b5cf6',
        BREAK: '#f59e0b',
        END: '#ef4444'
      };

      // Add markers
      const bounds = [];
      stops.forEach((stop, index) => {
        const color = colors[stop.type] || '#f9a826';
        const marker = L.marker([stop.lat, stop.lng], {
          icon: createIcon(color, index + 1)
        }).addTo(map);

        // Popup content
        const popupContent = `
          <div style="min-width: 200px; padding: 5px;">
            <div style="font-weight: bold; color: ${color}; margin-bottom: 5px;">
              ${stop.type} Point #${index + 1}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
              <strong>Time:</strong> ${stop.time}<br>
              <strong>Date:</strong> ${stop.date}
            </div>
            <div style="font-size: 11px; color: #333; border-top: 1px solid #eee; padding-top: 5px;">
              ${stop.address}
            </div>
            <div style="font-size: 11px; color: #10b981; margin-top: 5px;">
              ${stop.kmFromStart.toFixed(2)} km from start
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        
        bounds.push([stop.lat, stop.lng]);
        markersRef.current.push(marker);
      });

      // Draw route line
      if (stops.length > 1) {
        const routeCoords = stops.map(s => [s.lat, s.lng]);
        polylineRef.current = L.polyline(routeCoords, {
          color: '#f9a826',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(map);
      }

      // Fit map to show all markers
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedJourney]);

  // Filter journeys with date range
  const filteredJourneys = journeys.filter(j => {
    // Date range filter
    let matchDate = true;
    if (filterFromDate || filterToDate) {
      if (!j.DATE) return false;
      
      // Convert DD/MM/YYYY to YYYY-MM-DD for comparison
      const dateParts = j.DATE.split('/');
      if (dateParts.length === 3) {
        const journeyDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
        
        if (filterFromDate && journeyDate < filterFromDate) matchDate = false;
        if (filterToDate && journeyDate > filterToDate) matchDate = false;
      }
    }
    
    // Driver filter
    const matchDriver = !filterDriver || filterDriver === "all" || j.DRIVERNAME?.toLowerCase().includes(filterDriver.toLowerCase());
    
    return matchDate && matchDriver;
  });

  // Get unique drivers for filter
  const uniqueDrivers = [...new Set(journeys.map(j => j.DRIVERNAME).filter(Boolean))];

  // Generate PDF Report
  // CSV Export Function - No external libraries needed!
  const exportAsCSV = () => {
    if (filteredJourneys.length === 0) {
      toast.error("No journeys to export!");
      return;
    }

    try {
      // CSV Headers
      const headers = [
        'S.No',
        'Journey ID',
        'Date',
        'Driver Name',
        'Cab No',
        'Start Time',
        'End Time',
        'Total KM',
        'Total Stops',
        'Start Location',
        'End Location',
        'GPS Enabled',
        'Status'
      ];

      // CSV Rows
      const rows = filteredJourneys.map((journey, index) => [
        index + 1,
        journey.JOURNEYID || 'N/A',
        journey.DATE || 'N/A',
        journey.DRIVERNAME || 'N/A',
        journey.CABNO || 'N/A',
        journey.STARTTIME || 'N/A',
        journey.ENDTIME || 'N/A',
        journey.TOTALKM || '0',
        journey.TOTALSTOPS || '0',
        journey.STARTLOCATION || 'N/A',
        journey.ENDLOCATION || 'N/A',
        journey.GPSENABLED || 'N/A',
        journey.STATUS || 'N/A'
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Journey_History_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV downloaded successfully!");
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast.error("Failed to export CSV. Please try again.");
    }
  };

  // Browser-Native Print to PDF (No jsPDF needed!)
  const generatePDFReport = () => {
    if (filteredJourneys.length === 0) {
      toast.error("No journeys to export!");
      return;
    }

    try {
      // Calculate summary
      const totalDistance = filteredJourneys.reduce((sum, j) => sum + (parseFloat(j.TOTALKM) || 0), 0);
      const totalStops = filteredJourneys.reduce((sum, j) => sum + (parseInt(j.TOTALSTOPS) || 0), 0);
      
      const fromDate = filterFromDate || 'Start';
      const toDate = filterToDate || 'End';
      const driverText = filterDriver && filterDriver !== "all" ? filterDriver : 'All Drivers';

      // Create HTML report
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Journey History Report</title>
          <style>
            @media print {
              @page { margin: 1cm; size: A4; }
              body { margin: 0; }
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #333;
              line-height: 1.6;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px;
              margin-bottom: 25px;
            }
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              margin: 5px 0;
              font-size: 14px;
              opacity: 0.95;
            }
            .filters {
              background: #f8fafc;
              padding: 15px 20px;
              border-left: 4px solid #f59e0b;
              margin-bottom: 20px;
              border-radius: 4px;
            }
            .filters h3 {
              margin: 0 0 10px 0;
              color: #1e293b;
              font-size: 16px;
            }
            .filters p {
              margin: 5px 0;
              color: #475569;
              font-size: 14px;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 25px;
            }
            .summary-card {
              background: #f59e0b;
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
            }
            .summary-card h4 {
              margin: 0 0 8px 0;
              font-size: 14px;
              font-weight: 600;
              opacity: 0.95;
            }
            .summary-card p {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              background: white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th {
              background: #1e293b;
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-size: 13px;
              font-weight: 600;
            }
            td {
              padding: 10px 8px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 12px;
              color: #334155;
            }
            tr:hover {
              background: #f8fafc;
            }
            .footer {
              text-align: center;
              color: #94a3b8;
              font-size: 11px;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
            }
            @media print {
              .summary { page-break-inside: avoid; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚗 UNION SERVICES</h1>
            <p>GPS Journey History Report</p>
            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
          </div>

          <div class="filters">
            <h3>📋 Report Filters</h3>
            <p><strong>Date Range:</strong> ${fromDate} to ${toDate}</p>
            <p><strong>Driver:</strong> ${driverText}</p>
          </div>

          <div class="summary">
            <div class="summary-card">
              <h4>Total Journeys</h4>
              <p>${filteredJourneys.length}</p>
            </div>
            <div class="summary-card">
              <h4>Total Distance</h4>
              <p>${totalDistance.toFixed(2)} km</p>
            </div>
            <div class="summary-card">
              <h4>Total Stops</h4>
              <p>${totalStops}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Journey ID</th>
                <th>Date</th>
                <th>Driver</th>
                <th>Cab</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>KM</th>
                <th>Stops</th>
              </tr>
            </thead>
            <tbody>
              ${filteredJourneys.map((journey, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${journey.JOURNEYID || 'N/A'}</td>
                  <td>${journey.DATE || 'N/A'}</td>
                  <td>${journey.DRIVERNAME || 'N/A'}</td>
                  <td>${journey.CABNO || 'N/A'}</td>
                  <td>${journey.STARTTIME || 'N/A'}</td>
                  <td>${journey.ENDTIME || 'N/A'}</td>
                  <td>${journey.TOTALKM || '0'}</td>
                  <td>${journey.TOTALSTOPS || '0'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Union Services - GPS Journey Report | Confidential</p>
            <p>This report was auto-generated from GPS tracking data</p>
          </div>
        </body>
        </html>
      `;

      // Open in new window and trigger print
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          toast.success("Print dialog opened! Save as PDF from there.");
        }, 250);
      };
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dateStr;
  };

  return (
    <div className="journey-history-wrapper">
      <CommonSection title="Journey History & Map" />
      
      <Container className="journey-container">
        <Row>
          {/* Left Panel - Journey List */}
          <Col lg="5" md="6" className="mb-4">
            <div className="journey-list-panel">
              <div className="panel-header">
                <h3>
                  <i className="ri-history-line"></i>
                  All Journeys
                </h3>
                <span className="count-badge">{filteredJourneys.length}</span>
              </div>

              {/* GPS Button */}
              {!isOnGPSPage && (
                <div className="gps-nav-btn-wrapper">
                  <button 
                    className="gps-nav-btn"
                    onClick={() => navigate('/gps-tracking')}
                  >
                    <i className="ri-gps-line"></i>
                    Go to GPS Track
                  </button>
                </div>
              )}

              {/* Filters */}
              <div className="filters-section">
                <div className="filter-item">
                  <label><i className="ri-calendar-line"></i> From Date</label>
                  <input
                    type="date"
                    value={filterFromDate}
                    onChange={(e) => setFilterFromDate(e.target.value)}
                    className="filter-input"
                  />
                </div>
                <div className="filter-item">
                  <label><i className="ri-calendar-line"></i> To Date</label>
                  <input
                    type="date"
                    value={filterToDate}
                    onChange={(e) => setFilterToDate(e.target.value)}
                    className="filter-input"
                  />
                </div>
                <div className="filter-item">
                  <label><i className="ri-user-line"></i> Driver</label>
                  <select
                    value={filterDriver}
                    onChange={(e) => setFilterDriver(e.target.value)}
                    className="filter-input"
                  >
                    <option value="all">All Drivers</option>
                    {uniqueDrivers.map((driver, i) => (
                      <option key={i} value={driver}>{driver}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-item export-buttons">
                  <button
                    onClick={exportAsCSV}
                    className="csv-export-btn"
                    disabled={filteredJourneys.length === 0}
                    title="Export to Excel/CSV"
                  >
                    <i className="ri-file-excel-line"></i>
                    Export CSV
                  </button>
                  <button
                    onClick={generatePDFReport}
                    className="pdf-download-btn"
                    disabled={filteredJourneys.length === 0}
                    title="Print or Save as PDF"
                  >
                    <i className="ri-printer-line"></i>
                    Print Report
                  </button>
                </div>
                {(filterFromDate || filterToDate || filterDriver) && filterDriver !== "all" && (
                  <button 
                    className="clear-filters-btn"
                    onClick={() => { setFilterFromDate(""); setFilterToDate(""); setFilterDriver("all"); }}
                  >
                    <i className="ri-close-line"></i> Clear
                  </button>
                )}
              </div>

              {/* Journey Cards */}
              <div className="journey-list">
                {isLoading ? (
                  <div className="loading-state">
                    <Spinner color="warning" />
                    <span>Loading journeys...</span>
                  </div>
                ) : filteredJourneys.length === 0 ? (
                  <div className="empty-state">
                    <i className="ri-map-pin-line"></i>
                    <span>No journeys found</span>
                    <small>Start a journey from GPS Tracking page</small>
                  </div>
                ) : (
                  filteredJourneys.map((journey, index) => (
                    <div
                      key={index}
                      className={`journey-card ${selectedJourney?.JOURNEYID === journey.JOURNEYID ? 'active' : ''}`}
                      onClick={() => setSelectedJourney(journey)}
                    >
                      <div className="journey-card-header">
                        <span className="journey-id">{journey.JOURNEYID}</span>
                        <span className="journey-date">{formatDate(journey.DATE)}</span>
                      </div>
                      <div className="journey-card-stats">
                        <div className="stat">
                          <i className="ri-user-3-line"></i>
                          <span>{journey.DRIVERNAME}</span>
                        </div>
                        <div className="stat">
                          <i className="ri-road-map-line"></i>
                          <span>{journey.TOTALKM} km</span>
                        </div>
                        <div className="stat">
                          <i className="ri-map-pin-line"></i>
                          <span>{journey.TOTALSTOPS || journey.stops?.length} stops</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Col>

          {/* Right Panel - Details & Map Separate */}
          <Col lg="7" md="6">
            {!selectedJourney ? (
              <div className="map-panel">
                <div className="map-placeholder">
                  <i className="ri-map-2-line"></i>
                  <span>Select a journey to view details</span>
                  <small>Click on any journey card from the list</small>
                </div>
              </div>
            ) : (
              <>
                {/* Details Card */}
                <div className="details-card">
                  <div className="details-header">
                    <div className="details-title">
                      <span className="journey-id-large">{selectedJourney.JOURNEYID}</span>
                      <span className="journey-date-badge">{selectedJourney.DATE}</span>
                    </div>
                    <button className="close-btn" onClick={() => setSelectedJourney(null)}>
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                  <div className="details-grid">
                    <div className="detail-item">
                      <i className="ri-user-3-line"></i>
                      <div><span className="label">Driver</span><span className="value">{selectedJourney.DRIVERNAME}</span></div>
                    </div>
                    <div className="detail-item">
                      <i className="ri-car-line"></i>
                      <div><span className="label">Vehicle</span><span className="value">{selectedJourney.CABNO}</span></div>
                    </div>
                    <div className="detail-item highlight">
                      <i className="ri-road-map-line"></i>
                      <div><span className="label">Distance</span><span className="value">{selectedJourney.TOTALKM} km</span></div>
                    </div>
                    <div className="detail-item">
                      <i className="ri-map-pin-line"></i>
                      <div><span className="label">Stops</span><span className="value">{selectedJourney.TOTALSTOPS || selectedJourney.stops?.length}</span></div>
                    </div>
                  </div>
                </div>

                {/* Map Card - Separate */}
                <div className="map-card">
                  <div className="map-card-header">
                    <i className="ri-road-map-line"></i>
                    <span>Route Map</span>
                  </div>
                  <div className="map-container">
                    <div ref={mapRef} className="map-view"></div>
                  </div>
                </div>

                {/* Stops Table Card - Separate */}
                {selectedJourney.stops && selectedJourney.stops.length > 0 && (
                  <div className="stops-card">
                    <div className="stops-card-header">
                      <i className="ri-list-check-2"></i>
                      <span>All Stops ({selectedJourney.stops.length})</span>
                    </div>
                    <div className="stops-table-wrapper">
                      <table className="stops-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Time</th>
                            <th>Address</th>
                            <th>KM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedJourney.stops.map((stop, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td><span className={`type-badge ${stop.type.toLowerCase()}`}>{stop.type}</span></td>
                              <td>{stop.time}</td>
                              <td className="address-cell">{stop.address}</td>
                              <td><span className="km-value">{stop.kmFromStart.toFixed(2)}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default JourneyHistory;
