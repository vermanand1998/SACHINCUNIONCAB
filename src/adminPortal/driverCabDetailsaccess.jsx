import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { googleSheetUrl } from '../urlandKeys';
import { fetchAllConfig } from '../services/configService';
import './driverCabDetails.css';

function DriverCabDetailsAccess() {
  const [contactData, setContactData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [filters, setFilters] = useState({
    empId: '',
    driverName: ''
  });
  const [loading, setLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);

  // Load companies and drivers on mount
  useEffect(() => {
    const loadConfig = async () => {
      setConfigLoading(true);
      try {
        const config = await fetchAllConfig();
        setCompanies(config.companies || []);
        setDrivers(config.drivers || []);
        
        if (config.companies && config.companies.length > 0) {
          setSelectedCompany(config.companies[0].sheetName);
        }
      } catch (error) {
        console.error('Error loading config:', error);
        toast.error('Failed to load configuration');
      } finally {
        setConfigLoading(false);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyData(selectedCompany);
    }
  }, [selectedCompany]);

  const fetchCompanyData = async (sheetName) => {
    setLoading(true);
    try {
      const response = await fetch(`${googleSheetUrl}?action=getTripRecords&sheetName=${sheetName}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setContactData(data.data);
        } else {
          await fetchWithPost(sheetName);
        }
      } else {
        await fetchWithPost(sheetName);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      await fetchWithPost(sheetName);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithPost = async (sheetName) => {
    try {
      const formData = new FormData();
      formData.append('action', 'getTripRecords');
      formData.append('SHEET_NAME', sheetName);
      
      const response = await fetch(googleSheetUrl, { method: 'POST', body: formData });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setContactData(data.data);
        } else if (data.data) {
          setContactData(data.data);
        } else {
          setContactData([]);
        }
      }
    } catch (error) {
      console.error('Fallback fetch error:', error);
      setContactData([]);
    }
  };

  useEffect(() => {
    let result = contactData;
    if (filters.empId) {
      result = result.filter(item => item.EMPID && item.EMPID.toString().toLowerCase().includes(filters.empId.toLowerCase()));
    }
    if (filters.driverName) {
      result = result.filter(item => item.DRIVERNAME && item.DRIVERNAME.toLowerCase().includes(filters.driverName.toLowerCase()));
    }
    setFilteredData(result);
  }, [contactData, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ empId: '', driverName: '' });
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setContactData([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (timeValue) => {
    if (!timeValue) return '-';
    const trimmed = String(timeValue).trim();
    const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
    if (ampmMatch) return `${parseInt(ampmMatch[1])}:${ampmMatch[2]} ${ampmMatch[3].toUpperCase()}`;
    const time24Match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (time24Match) {
      const hours = parseInt(time24Match[1], 10);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${time24Match[2]} ${period}`;
    }
    return trimmed;
  };

  const displayValue = (value) => value || '-';

  const getDriversForCompany = () => {
    const company = companies.find(c => c.sheetName === selectedCompany);
    if (!company) return [];
    return drivers.filter(d => d.companyId === company.id);
  };

  const companyDrivers = getDriversForCompany();

  return (
    <div className="trip-records-container">
      {/* Header */}
      <div className="trip-records-header">
        <div className="header-info">
          <h3>📊 Trip Records</h3>
          <p>View trip records by company</p>
        </div>
        <div className="company-selector">
          <label>SELECT COMPANY:</label>
          <select value={selectedCompany} onChange={handleCompanyChange} disabled={configLoading}>
            <option value="">-- Select Company --</option>
            {companies.map(company => (
              <option key={company.id} value={company.sheetName}>
                {company.name} ({company.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedCompany ? (
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h4>Select a Company</h4>
          <p>Choose a company from the dropdown above to view trip records</p>
        </div>
      ) : loading ? (
        <div className="loading-state">
          <Spinner color="warning" />
          <p>Loading trip records...</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="trip-filters">
            <input
              type="text"
              name="empId"
              placeholder="🔍 Filter by Emp ID"
              value={filters.empId}
              onChange={handleFilterChange}
            />
            <select name="driverName" value={filters.driverName} onChange={handleFilterChange}>
              <option value="">All Drivers</option>
              {companyDrivers.map(d => (
                <option key={d.id} value={d.driverName}>{d.cabNo} - {d.driverName}</option>
              ))}
            </select>
            <button className="clear-btn" onClick={handleClearFilters}>Clear Filters</button>
            <span className="record-count">{filteredData.length} Records</span>
          </div>

          {/* Table */}
          {filteredData.length > 0 ? (
            <div className="trip-table-wrapper">
              <table className="trip-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>TRIP ID</th>
                    <th>CAB NO</th>
                    <th>VENDOR</th>
                    <th>DRIVER</th>
                    <th>DRIVER MOBILE</th>
                    <th>ESCORT</th>
                    <th>ESCORT ID/MOBILE</th>
                    <th>EMPLOYEE</th>
                    <th>EMP ID</th>
                    <th>TRIP TYPE</th>
                    <th>PICKUP LOC</th>
                    <th>PICKUP TIME</th>
                    <th>PICKUP KM</th>
                    <th>DROPOFF LOC</th>
                    <th>DROPOFF TIME</th>
                    <th>DROPOFF KM</th>
                    <th>TOTAL KM</th>
                    <th>SHIFT</th>
                    <th>GPS</th>
                    <th>DELAY</th>
                    <th>REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record, index) => (
                    <tr key={index}>
                      <td>{formatDate(record.DATE)}</td>
                      <td className="trip-id">{displayValue(record.TRIPID)}</td>
                      <td>{displayValue(record.CABNO)}</td>
                      <td>{displayValue(record.VENDORNAME)}</td>
                      <td>{displayValue(record.DRIVERNAME)}</td>
                      <td>{displayValue(record.DRIVERMOBILE)}</td>
                      <td>{displayValue(record.ESCORTNAME)}</td>
                      <td>{displayValue(record.ESCORTIDMOBILE || record.ESCORTMOBILE)}</td>
                      <td>{displayValue(record.EMPLOYEENAME)}</td>
                      <td>{displayValue(record.EMPID)}</td>
                      <td>
                        <span className={`trip-type ${(record.TRIPTYPE || '').toLowerCase()}`}>
                          {displayValue(record.TRIPTYPE)}
                        </span>
                      </td>
                      <td>{displayValue(record.PICKUPLOCATION)}</td>
                      <td>{formatTime(record.PICKUPTIME)}</td>
                      <td>{displayValue(record.PICKUPMETERREADING)}</td>
                      <td>{displayValue(record.DROPOFFLOCATION)}</td>
                      <td>{formatTime(record.DROPOFFTIME)}</td>
                      <td>{displayValue(record.DROPOFFMETERREADING)}</td>
                      <td className="total-km">{displayValue(record.TOTALKM)}</td>
                      <td>{displayValue(record.SHIFTTIMING)}</td>
                      <td>
                        <span className={`gps-status ${record.GPSENABLED === 'Y' || record.GPSENABLED === 'YES' ? 'yes' : 'no'}`}>
                          {displayValue(record.GPSENABLED)}
                        </span>
                      </td>
                      <td>
                        <span className={`delay-status ${record.DELAY === 'Y' || record.DELAY === 'YES' ? 'yes' : 'no'}`}>
                          {displayValue(record.DELAY)}
                        </span>
                      </td>
                      <td>{displayValue(record.REMARKS)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-records">
              <div className="no-records-icon">📋</div>
              <p>No trip records found for this company</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DriverCabDetailsAccess;
