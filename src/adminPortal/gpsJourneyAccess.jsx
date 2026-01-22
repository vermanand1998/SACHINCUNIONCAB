import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "reactstrap";
import { googleSheetUrl } from "../urlandKeys";
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";

const GPSJourneyAccess = () => {
  const [journeys, setJourneys] = useState([]);
  const [filteredJourneys, setFilteredJourneys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnGPSPage = location.pathname === '/gps-tracking';

  // Handle resize for responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchJourneys();
  }, []);

  useEffect(() => {
    let filtered = journeys;
    
    // Date range filter
    if (filterFromDate || filterToDate) {
      filtered = filtered.filter(j => {
        if (!j.DATE) return false;
        
        // Convert DD/MM/YYYY to YYYY-MM-DD for comparison
        const dateParts = j.DATE.split('/');
        if (dateParts.length === 3) {
          const journeyDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
          
          if (filterFromDate && journeyDate < filterFromDate) return false;
          if (filterToDate && journeyDate > filterToDate) return false;
        }
        return true;
      });
    }
    
    // Driver filter
    if (filterDriver && filterDriver !== "all") {
      filtered = filtered.filter(j => j.DRIVERNAME?.toLowerCase().includes(filterDriver.toLowerCase()));
    }
    
    setFilteredJourneys(filtered);
  }, [journeys, filterFromDate, filterToDate, filterDriver]);

  const fetchJourneys = async () => {
    setIsLoading(true);
    try {
      // Use FormData to avoid CORS issues with Google Apps Script
      const formData = new FormData();
      formData.append('key', 'G');
      
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          // Debug: Log the raw data to see SUSPICIOUS values
          console.log("📊 Raw journey data from Google Sheets:", data.data);
          console.log("📊 SUSPICIOUS values:", data.data.map(j => ({ id: j.JOURNEYID, suspicious: j.SUSPICIOUS, recovered: j.RECOVERED, gpsLost: j.GPSLOST })));
          
          const parsedJourneys = data.data.map(journey => ({
            ...journey,
            stops: journey.ALLSTOPS ? JSON.parse(journey.ALLSTOPS) : []
          }));
          setJourneys(parsedJourneys);
          setFilteredJourneys(parsedJourneys);
        }
      }
    } catch (error) {
      console.error("Error fetching journeys:", error);
      // Load from localStorage as fallback
      const savedJourneys = JSON.parse(localStorage.getItem('savedJourneys') || '[]');
      if (savedJourneys.length > 0) {
        const formatted = savedJourneys.map(j => ({
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
        }));
        setJourneys(formatted);
        setFilteredJourneys(formatted);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Leaflet Map
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
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const stops = selectedJourney.stops || [];
      if (stops.length === 0) return;

      const map = L.map(mapRef.current).setView([stops[0].lat, stops[0].lng], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      const createIcon = (color, number) => {
        return L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background: ${color};
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 11px;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">${number}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
      };

      const colors = {
        START: '#10b981',
        PICKUP: '#3b82f6',
        DROP: '#8b5cf6',
        BREAK: '#f59e0b',
        END: '#ef4444'
      };

      const bounds = [];
      stops.forEach((stop, index) => {
        const color = colors[stop.type] || '#f9a826';
        const marker = L.marker([stop.lat, stop.lng], {
          icon: createIcon(color, index + 1)
        }).addTo(map);

        const popupContent = `
          <div style="min-width: 180px; padding: 5px;">
            <div style="font-weight: bold; color: ${color}; margin-bottom: 5px;">
              ${stop.type} #${index + 1}
            </div>
            <div style="font-size: 11px; color: #666;">
              <strong>Time:</strong> ${stop.time}<br>
              <strong>KM:</strong> ${stop.kmFromStart?.toFixed(2) || 0} km
            </div>
            <div style="font-size: 10px; color: #333; margin-top: 5px;">
              ${stop.address}
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        
        bounds.push([stop.lat, stop.lng]);
      });

      if (stops.length > 1) {
        const routeCoords = stops.map(s => [s.lat, s.lng]);
        L.polyline(routeCoords, {
          color: '#f9a826',
          weight: 3,
          opacity: 0.8,
          dashArray: '8, 8'
        }).addTo(map);
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedJourney]);

  const uniqueDrivers = [...new Set(journeys.map(j => j.DRIVERNAME).filter(Boolean))];

  // Export as CSV (No external library needed!)
  const exportAsCSV = () => {
    if (filteredJourneys.length === 0) {
      toast.error("No journeys to export!");
      return;
    }

    try {
      // CSV Headers
      const headers = ['#', 'Journey ID', 'Date', 'Driver', 'Cab', 'Vehicle', 'Start Time', 'End Time', 'Total KM', 'Total Stops', 'Status'];
      
      // CSV Rows
      const rows = filteredJourneys.map((journey, index) => {
        const suspicious = isSuspicious(journey);
        return [
          index + 1,
          journey.JOURNEYID || 'N/A',
          journey.DATE || 'N/A',
          journey.DRIVERNAME || 'N/A',
          journey.CABNO || 'N/A',
          journey.VEHICLENO || 'N/A',
          journey.STARTTIME || 'N/A',
          journey.ENDTIME || 'N/A',
          journey.TOTALKM || '0',
          journey.TOTALSTOPS || '0',
          suspicious ? 'Review' : 'OK'
        ];
      });
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `GPS_Journey_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('📊 CSV Report Downloaded!');
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast.error("Failed to export CSV. Please try again.");
    }
  };

  // Generate PDF Report (Alternative using print)
  const generatePDFReport = () => {
    if (filteredJourneys.length === 0) {
      toast.error("No journeys to export!");
      return;
    }

    try {
      // Create printable HTML
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Please allow popups to generate PDF");
        return;
      }

      
      // Calculate summary
      const totalJourneys = filteredJourneys.length;
      const totalDistance = filteredJourneys.reduce((sum, j) => sum + (parseFloat(j.TOTALKM) || 0), 0);
      const totalStops = filteredJourneys.reduce((sum, j) => sum + (parseInt(j.TOTALSTOPS) || 0), 0);
      const suspiciousCount = filteredJourneys.filter(j => isSuspicious(j)).length;
      
      // Create HTML for printing
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>GPS Journey Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0 0 0; font-size: 14px; }
            .filters { margin: 20px 0; padding: 10px; background: #f8fafc; border-left: 4px solid #f59e0b; }
            .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; }
            .stat { background: #fef3c7; padding: 15px; text-align: center; border-radius: 8px; }
            .stat-label { font-size: 12px; color: #92400e; }
            .stat-value { font-size: 20px; font-weight: bold; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #1e293b; color: white; padding: 10px; text-align: left; font-size: 11px; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
            tr:nth-child(even) { background: #f8fafc; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>UNION SERVICES</h1>
            <p>GPS Journey Report</p>
            <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
          </div>
          
          <div class="filters">
            <strong>Filters:</strong> 
            ${filterFromDate || filterToDate ? `Date: ${filterFromDate || 'Start'} to ${filterToDate || 'End'} | ` : ''}
            Driver: ${filterDriver && filterDriver !== "all" ? filterDriver : 'All Drivers'}
          </div>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-label">Total Journeys</div>
              <div class="stat-value">${totalJourneys}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Total Distance</div>
              <div class="stat-value">${totalDistance.toFixed(2)} km</div>
            </div>
            <div class="stat">
              <div class="stat-label">Total Stops</div>
              <div class="stat-value">${totalStops}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Suspicious</div>
              <div class="stat-value">${suspiciousCount}</div>
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
                <th>Time</th>
                <th>KM</th>
                <th>Stops</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredJourneys.map((j, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${j.JOURNEYID || 'N/A'}</td>
                  <td>${j.DATE || 'N/A'}</td>
                  <td>${j.DRIVERNAME || 'N/A'}</td>
                  <td>${j.CABNO || 'N/A'}</td>
                  <td>${j.STARTTIME || ''} - ${j.ENDTIME || ''}</td>
                  <td>${j.TOTALKM || '0'}</td>
                  <td>${j.TOTALSTOPS || '0'}</td>
                  <td>${isSuspicious(j) ? '⚠ Review' : '✓ OK'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 20px 0;">
            Print / Save as PDF
          </button>
          <button class="no-print" onclick="window.close()" style="padding: 10px 20px; background: #64748b; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Close
          </button>
        </body>
        </html>
      `;
      
      printWindow.document.write(html);
      printWindow.document.close();
      
      toast.success('📄 Print preview opened! Use Print to save as PDF');
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  // Helper function to check if journey is suspicious
  const isSuspicious = (journey) => {
    // Check SUSPICIOUS field (handles various formats)
    const suspiciousValue = String(journey.SUSPICIOUS || '').toUpperCase().trim();
    if (suspiciousValue === 'YES' || suspiciousValue === '1' || suspiciousValue === 'TRUE') {
      return true;
    }
    
    // Also compute from actual data
    const recovered = parseInt(journey.RECOVERED) || 0;
    const gpsLost = parseInt(journey.GPSLOST) || 0;
    
    if (recovered > 0 || gpsLost > 3) {
      return true;
    }
    
    return false;
  };

  const styles = {
    container: { padding: '20px', fontFamily: "'Segoe UI', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' },
    title: { fontSize: '18px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' },
    filters: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' },
    filterGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
    filterLabel: { fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
    filterInput: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', minWidth: '140px', outline: 'none' },
    tableWrapper: { overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
    th: { background: '#1e293b', color: '#fff', padding: '10px 12px', textAlign: 'left', fontWeight: '600', fontSize: '10px', textTransform: 'uppercase', whiteSpace: 'nowrap' },
    td: { padding: '10px 12px', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap', fontSize: '12px' },
    viewBtn: { background: '#f59e0b', color: '#1e293b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '11px' },
    csvBtn: { background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', transition: 'all 0.2s' },
    pdfBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', transition: 'all 0.2s' },
    gpsBtn: { background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' },
    badge: { display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: isMobile ? '10px' : '20px', overflowY: 'auto' },
    modal: { background: '#fff', borderRadius: '12px', width: '100%', maxWidth: isMobile ? '100%' : '900px', maxHeight: isMobile ? 'none' : '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', overflow: isMobile ? 'visible' : 'hidden', margin: isMobile ? '10px 0' : '20px 0' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#1e293b', color: '#f59e0b', borderBottom: '3px solid #f59e0b', flexShrink: 0 },
    modalTitle: { fontSize: isMobile ? '12px' : '14px', fontWeight: '700', fontFamily: "'Courier New', monospace" },
    closeBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalBody: { display: 'flex', flexDirection: 'column', flex: 1, overflow: isMobile ? 'visible' : 'auto' },
    detailsSection: { background: '#f8fafc', padding: '15px', borderBottom: '1px solid #e2e8f0' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
    statCard: { background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' },
    statValue: { fontSize: '12px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' },
    statLabel: { fontSize: '9px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' },
    addressBox: { marginTop: '12px', padding: '10px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' },
    mapSection: { height: isMobile ? '250px' : '320px', flexShrink: 0 },
    stopsSection: { borderTop: '1px solid #e2e8f0' },
    stopsHeader: { fontSize: '12px', fontWeight: '600', padding: '10px 15px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    stopsTableWrapper: { maxHeight: isMobile ? '200px' : '180px', overflowY: 'auto', overflowX: 'auto' },
    stopsTable: { width: '100%', borderCollapse: 'collapse', fontSize: '11px' },
    emptyState: { textAlign: 'center', padding: '50px 20px', color: '#64748b' },
    loading: { textAlign: 'center', padding: '50px 20px' }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🛰️</span>
          GPS Journey Records
          <span style={{ ...styles.badge, background: '#dcfce7', color: '#166534' }}>{filteredJourneys.length}</span>
        </div>
        <div style={styles.filters}>
          {!isOnGPSPage && (
            <button
              onClick={() => navigate('/gps-tracking')}
              style={styles.gpsBtn}
            >
              <i className="ri-gps-line" style={{ fontSize: '16px' }}></i>
              Go to GPS Track
            </button>
          )}
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>From Date</span>
            <input
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              style={styles.filterInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>To Date</span>
            <input
              type="date"
              value={filterToDate}
              onChange={(e) => setFilterToDate(e.target.value)}
              style={styles.filterInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Driver</span>
            <select
              value={filterDriver}
              onChange={(e) => setFilterDriver(e.target.value)}
              style={styles.filterInput}
            >
              <option value="all">All Drivers</option>
              {uniqueDrivers.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchJourneys}
            style={{ ...styles.viewBtn, alignSelf: 'flex-end' }}
          >
            🔄 Refresh
          </button>
          <button
            onClick={exportAsCSV}
            style={{ ...styles.csvBtn, alignSelf: 'flex-end' }}
            disabled={filteredJourneys.length === 0}
          >
            📊 Export CSV
          </button>
          <button
            onClick={generatePDFReport}
            style={{ ...styles.pdfBtn, alignSelf: 'flex-end' }}
            disabled={filteredJourneys.length === 0}
          >
            📄 Print Report
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={styles.loading}>
          <Spinner color="warning" />
          <p>Loading journeys...</p>
        </div>
      ) : filteredJourneys.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📍</div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>No GPS Journeys Found</div>
          <div style={{ fontSize: '13px' }}>Journeys will appear here once drivers start tracking</div>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Journey ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Driver</th>
                <th style={styles.th}>Cab</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Total KM</th>
                <th style={styles.th}>Stops</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJourneys.map((journey, index) => {
                const suspicious = isSuspicious(journey);
                return (
                  <tr key={index} style={{ 
                    background: suspicious ? '#fef2f2' : (index % 2 === 0 ? '#fff' : '#f8fafc'),
                    borderLeft: suspicious ? '3px solid #dc2626' : 'none'
                  }}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                      {journey.JOURNEYID}
                      {suspicious && (
                        <span style={{ color: '#dc2626', marginLeft: '5px' }}>⚠️</span>
                      )}
                    </td>
                    <td style={styles.td}>{journey.DATE}</td>
                    <td style={styles.td}>{journey.DRIVERNAME}</td>
                    <td style={styles.td}>{journey.CABNO} • {journey.VEHICLENO}</td>
                    <td style={styles.td}>{journey.STARTTIME} - {journey.ENDTIME}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: '#fef3c7', color: '#92400e' }}>
                        {journey.TOTALKM} km
                      </span>
                    </td>
                    <td style={styles.td}>{journey.TOTALSTOPS || journey.stops?.length || 0}</td>
                    <td style={styles.td}>
                      {suspicious ? (
                        <span style={{ ...styles.badge, background: '#fee2e2', color: '#dc2626' }} title={`Auto-logs: ${journey.AUTOLOGS || 0}, GPS Lost: ${journey.GPSLOST || 0}, Recovered: ${journey.RECOVERED || 0}`}>
                          ⚠️ Review
                        </span>
                      ) : (
                        <span style={{ ...styles.badge, background: '#dcfce7', color: '#166534' }}>
                          ✓ OK
                        </span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.viewBtn}
                        onClick={() => setSelectedJourney(journey)}
                      >
                        📍 View Map
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedJourney && (
        <div style={styles.modalOverlay} onClick={() => setSelectedJourney(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>{selectedJourney.JOURNEYID} • {selectedJourney.DATE}</span>
              <button style={styles.closeBtn} onClick={() => setSelectedJourney(null)}>×</button>
            </div>

            {/* Body - Stacked Layout */}
            <div style={styles.modalBody}>
              {/* Details Section */}
              <div style={styles.detailsSection}>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Driver</div>
                    <div style={styles.statValue}>{selectedJourney.DRIVERNAME}</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Cab No</div>
                    <div style={styles.statValue}>{selectedJourney.CABNO}</div>
                  </div>
                  <div style={{ ...styles.statCard, background: '#fef3c7' }}>
                    <div style={styles.statLabel}>Total KM</div>
                    <div style={{ ...styles.statValue, color: '#92400e', fontSize: '16px' }}>{selectedJourney.TOTALKM} km</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Stops</div>
                    <div style={styles.statValue}>{selectedJourney.TOTALSTOPS || selectedJourney.stops?.length}</div>
                  </div>
                </div>
                <div style={styles.addressBox}>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <div style={{ fontSize: '9px', color: '#10b981', textTransform: 'uppercase', fontWeight: '600', marginBottom: '3px' }}>📍 Start</div>
                      <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.4' }}>{selectedJourney.STARTADDRESS}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <div style={{ fontSize: '9px', color: '#ef4444', textTransform: 'uppercase', fontWeight: '600', marginBottom: '3px' }}>🏁 End</div>
                      <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.4' }}>{selectedJourney.ENDADDRESS}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div ref={mapRef} style={styles.mapSection}></div>

              {/* Stops Table Section */}
              {selectedJourney.stops && selectedJourney.stops.length > 0 && (
                <div style={styles.stopsSection}>
                  <div style={styles.stopsHeader}>📍 All Stop Points ({selectedJourney.stops.length})</div>
                  <div style={styles.stopsTableWrapper}>
                    <table style={styles.stopsTable}>
                      <thead>
                        <tr>
                          <th style={{ ...styles.th, padding: '6px 8px', position: 'sticky', top: 0 }}>#</th>
                          <th style={{ ...styles.th, padding: '6px 8px', position: 'sticky', top: 0 }}>Type</th>
                          <th style={{ ...styles.th, padding: '6px 8px', position: 'sticky', top: 0 }}>Time</th>
                          <th style={{ ...styles.th, padding: '6px 8px', position: 'sticky', top: 0 }}>Address</th>
                          <th style={{ ...styles.th, padding: '6px 8px', position: 'sticky', top: 0 }}>KM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedJourney.stops.map((stop, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                            <td style={{ ...styles.td, padding: '5px 8px', fontWeight: '600' }}>{i + 1}</td>
                            <td style={{ ...styles.td, padding: '5px 8px' }}>
                              <span style={{
                                ...styles.badge,
                                background: stop.type === 'START' ? '#dcfce7' :
                                           stop.type === 'END' ? '#fee2e2' :
                                           stop.type === 'PICKUP' ? '#dbeafe' :
                                           stop.type === 'DROP' ? '#ede9fe' : '#fef3c7',
                                color: stop.type === 'START' ? '#166534' :
                                       stop.type === 'END' ? '#991b1b' :
                                       stop.type === 'PICKUP' ? '#1e40af' :
                                       stop.type === 'DROP' ? '#5b21b6' : '#92400e'
                              }}>
                                {stop.type}
                              </span>
                            </td>
                            <td style={{ ...styles.td, padding: '5px 8px' }}>{stop.time}</td>
                            <td style={{ ...styles.td, padding: '5px 8px', maxWidth: isMobile ? '120px' : '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stop.address}</td>
                            <td style={{ ...styles.td, padding: '5px 8px' }}>{stop.kmFromStart?.toFixed(2)} km</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPSJourneyAccess;
