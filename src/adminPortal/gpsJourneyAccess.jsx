import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "reactstrap";
import { googleSheetUrl } from "../urlandKeys";
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAllConfig } from "../services/configService";
import "./gpsJourneyAccess.css";

const GPSJourneyAccess = () => {
  const [journeys, setJourneys] = useState([]);
  const [filteredJourneys, setFilteredJourneys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [filterDriver, setFilterDriver] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnGPSPage = location.pathname === '/gps-tracking';

  // Hide body scroll when modal is open
  useEffect(() => {
    if (selectedJourney) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedJourney]);

  // Load config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchAllConfig();
        setCompanies(config.companies || []);
        setDrivers(config.drivers || []);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => { fetchJourneys(); }, []);

  useEffect(() => {
    let filtered = journeys;
    if (filterCompany && filterCompany !== "all") {
      const companyDriverNames = drivers.filter(d => d.companyId === parseInt(filterCompany)).map(d => d.driverName.toLowerCase());
      filtered = filtered.filter(j => companyDriverNames.some(name => j.DRIVERNAME?.toLowerCase().includes(name)));
    }
    if (filterDriver && filterDriver !== "all") {
      filtered = filtered.filter(j => j.DRIVERNAME?.toLowerCase().includes(filterDriver.toLowerCase()));
    }
    setFilteredJourneys(filtered);
  }, [journeys, filterDriver, filterCompany, drivers]);

  const fetchJourneys = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('key', 'G');
      const response = await fetch(googleSheetUrl, { method: "POST", body: formData });
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
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
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!selectedJourney || !mapRef.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        if (window.L) { resolve(window.L); return; }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve(window.L);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    loadLeaflet().then(L => {
      if (mapInstanceRef.current) mapInstanceRef.current.remove();
      const stops = selectedJourney.stops || [];
      if (stops.length === 0) return;

      const map = L.map(mapRef.current).setView([stops[0].lat, stops[0].lng], 13);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

      const createIcon = (color, number) => L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:${color};color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:10px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${number}</div>`,
        iconSize: [26, 26], iconAnchor: [13, 13]
      });

      const colors = { START: '#10b981', PICKUP: '#3b82f6', DROP: '#8b5cf6', BREAK: '#f59e0b', END: '#ef4444' };
      const bounds = [];
      stops.forEach((stop, index) => {
        const color = colors[stop.type] || '#f9a826';
        const marker = L.marker([stop.lat, stop.lng], { icon: createIcon(color, index + 1) }).addTo(map);
        marker.bindPopup(`<div style="min-width:150px;padding:5px;"><div style="font-weight:bold;color:${color};margin-bottom:5px;">${stop.type} #${index + 1}</div><div style="font-size:11px;color:#666;"><strong>Time:</strong> ${stop.time}<br><strong>KM:</strong> ${stop.kmFromStart?.toFixed(2) || 0} km</div></div>`);
        bounds.push([stop.lat, stop.lng]);
      });
      if (stops.length > 1) L.polyline(stops.map(s => [s.lat, s.lng]), { color: '#f9a826', weight: 3, opacity: 0.8, dashArray: '8,8' }).addTo(map);
      if (bounds.length > 0) map.fitBounds(bounds, { padding: [30, 30] });
    });

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [selectedJourney]);

  const uniqueDrivers = [...new Set(journeys.map(j => j.DRIVERNAME).filter(Boolean))];

  const exportAsCSV = () => {
    if (filteredJourneys.length === 0) { toast.error("No journeys to export!"); return; }
    const headers = ['#', 'Journey ID', 'Date', 'Driver', 'Cab', 'Total KM', 'Stops', 'Status'];
    const rows = filteredJourneys.map((j, i) => [i + 1, j.JOURNEYID, j.DATE, j.DRIVERNAME, j.CABNO, j.TOTALKM, j.TOTALSTOPS, isSuspicious(j) ? 'Review' : 'OK']);
    let csv = headers.join(',') + '\n';
    rows.forEach(r => { csv += r.map(c => `"${c}"`).join(',') + '\n'; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `GPS_Journey_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('📊 CSV Downloaded!');
  };

  const generatePDFReport = () => {
    if (filteredJourneys.length === 0) { toast.error("No journeys to export!"); return; }
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error("Please allow popups"); return; }
    const totalDistance = filteredJourneys.reduce((sum, j) => sum + (parseFloat(j.TOTALKM) || 0), 0);
    const html = `<!DOCTYPE html><html><head><title>GPS Journey Report</title><style>body{font-family:Arial,sans-serif;margin:20px}.header{background:#1e293b;color:white;padding:20px;text-align:center}.header h1{margin:0;font-size:20px}table{width:100%;border-collapse:collapse;margin:20px 0}th{background:#1e293b;color:white;padding:8px;text-align:left;font-size:11px}td{padding:6px;border-bottom:1px solid #e2e8f0;font-size:11px}@media print{.no-print{display:none}}</style></head><body><div class="header"><h1>GPS Journey Report</h1><p>Total: ${filteredJourneys.length} journeys | ${totalDistance.toFixed(2)} km</p></div><table><thead><tr><th>#</th><th>Journey ID</th><th>Date</th><th>Driver</th><th>Cab</th><th>KM</th><th>Stops</th></tr></thead><tbody>${filteredJourneys.map((j, i) => `<tr><td>${i + 1}</td><td>${j.JOURNEYID}</td><td>${j.DATE}</td><td>${j.DRIVERNAME}</td><td>${j.CABNO}</td><td>${j.TOTALKM}</td><td>${j.TOTALSTOPS}</td></tr>`).join('')}</tbody></table><button class="no-print" onclick="window.print()" style="padding:10px 20px;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer">Print / Save as PDF</button></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    toast.success('📄 Print preview opened!');
  };

  const isSuspicious = (j) => {
    const val = String(j.SUSPICIOUS || '').toUpperCase().trim();
    return val === 'YES' || val === '1' || val === 'TRUE' || (parseInt(j.RECOVERED) || 0) > 0 || (parseInt(j.GPSLOST) || 0) > 3;
  };

  return (
    <div className="gps-journey-container">
      {/* Header */}
      <div className="gps-journey-header">
        <div className="header-title">
          <span>🛰️</span>
          <span>GPS Journey Records</span>
          <span className="count-badge">{filteredJourneys.length}</span>
        </div>
        {!isOnGPSPage && (
          <button className="gps-track-btn" onClick={() => navigate('/gps-tracking')}>
            <i className="ri-gps-line"></i> Go to GPS Track
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="gps-journey-filters">
        <div className="filter-group">
          <label>Company</label>
          <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
            <option value="all">All Companies</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Driver</label>
          <select value={filterDriver} onChange={(e) => setFilterDriver(e.target.value)}>
            <option value="all">All Drivers</option>
            {uniqueDrivers.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="filter-actions">
          <button className="refresh-btn" onClick={fetchJourneys}>🔄 Refresh</button>
          <button className="csv-btn" onClick={exportAsCSV} disabled={filteredJourneys.length === 0}>📊 Export CSV</button>
          <button className="pdf-btn" onClick={generatePDFReport} disabled={filteredJourneys.length === 0}>📄 Print Report</button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="loading-state"><Spinner color="warning" /><p>Loading journeys...</p></div>
      ) : filteredJourneys.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <div className="empty-title">No GPS Journeys Found</div>
          <div className="empty-text">Journeys will appear here once drivers start tracking</div>
        </div>
      ) : (
        <div className="gps-journey-table-wrapper">
          <table className="gps-journey-table">
            <thead>
              <tr>
                <th>JOURNEY ID</th>
                <th>DATE</th>
                <th>DRIVER</th>
                <th>CAB</th>
                <th>TIME</th>
                <th>TOTAL KM</th>
                <th>STOPS</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredJourneys.map((journey, index) => {
                const suspicious = isSuspicious(journey);
                return (
                  <tr key={index} className={suspicious ? 'suspicious-row' : ''}>
                    <td className="journey-id">{journey.JOURNEYID}</td>
                    <td>{journey.DATE}</td>
                    <td>{journey.DRIVERNAME}</td>
                    <td>{journey.CABNO}</td>
                    <td className="time-cell">{journey.STARTTIME} - {journey.ENDTIME}</td>
                    <td><span className="km-badge">{journey.TOTALKM} km</span></td>
                    <td>{journey.TOTALSTOPS || journey.stops?.length || 0}</td>
                    <td>
                      {suspicious ? (
                        <span className="status-badge review">⚠️ Review</span>
                      ) : (
                        <span className="status-badge ok">✓ OK</span>
                      )}
                    </td>
                    <td>
                      <button className="view-btn" onClick={() => setSelectedJourney(journey)}>📍 View</button>
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
        <div className="journey-modal-overlay" onClick={() => setSelectedJourney(null)}>
          <div className="journey-modal" onClick={(e) => e.stopPropagation()}>
            <div className="journey-modal-header">
              <div className="modal-title">
                <span>{selectedJourney.JOURNEYID}</span>
                <span className="modal-date">{selectedJourney.DATE}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedJourney(null)}>×</button>
            </div>
            <div className="journey-modal-body">
              <div className="modal-stats">
                <div className="stat-item">
                  <span className="stat-label">DRIVER</span>
                  <span className="stat-value">{selectedJourney.DRIVERNAME}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">CAB</span>
                  <span className="stat-value">{selectedJourney.CABNO}</span>
                </div>
                <div className="stat-item highlight">
                  <span className="stat-label">TOTAL KM</span>
                  <span className="stat-value">{selectedJourney.TOTALKM} km</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">STOPS</span>
                  <span className="stat-value">{selectedJourney.TOTALSTOPS}</span>
                </div>
              </div>
              <div className="modal-map" ref={mapRef}></div>
              {selectedJourney.stops && selectedJourney.stops.length > 0 && (
                <div className="modal-stops">
                  <div className="stops-header">📍 All Stops ({selectedJourney.stops.length})</div>
                  <div className="stops-table-wrapper">
                    <table className="stops-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>TYPE</th>
                          <th>TIME</th>
                          <th>ADDRESS</th>
                          <th>KM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedJourney.stops.map((stop, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td><span className={`stop-type ${stop.type.toLowerCase()}`}>{stop.type}</span></td>
                            <td>{stop.time}</td>
                            <td className="address-cell">{stop.address}</td>
                            <td>{stop.kmFromStart?.toFixed(2)}</td>
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
