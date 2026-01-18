import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { googleSheetUrl } from '../urlandKeys';
import './adminPortal'; // Import your CSS file for styling

function DriverCabDetailsAccess() {
  const [contactData, setContactData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    empId: '',
    driverName: '',
    tripType: ''
  });
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!dataFetched) {
          const response = await fetch(googleSheetUrl, {
            method: 'POST',
            body: JSON.stringify({ key: 'C' }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Data Received successfully:', data);

            setContactData(data.data); // Assuming 'data' property contains the array of contact details

            // toast.success('Contact Details Data Received Successfully!', {});
          } else {
            console.error('Request failed:', response.statusText);
            toast.error(`Request failed: ${response.statusText}`, {
              style: {
                color: 'white',
                backgroundColor: 'lightcoral',
              },
            });
          }

          setDataFetched(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        toast.error(`Error during fetch: ${error.message}`, {
          style: {
            color: 'white',
            backgroundColor: 'lightcoral',
          },
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [dataFetched]);

  // Add new useEffect for filtering
  useEffect(() => {
    let result = contactData;
    
    if (filters.date) {
      result = result.filter(item => item.DATE && item.DATE.includes(filters.date));
    }
    if (filters.empId) {
      result = result.filter(item => 
        item.EMPID && item.EMPID.toString().toLowerCase().includes(filters.empId.toLowerCase())
      );
    }
    if (filters.driverName) {
      result = result.filter(item => 
        item.DRIVERNAME && item.DRIVERNAME.toLowerCase().includes(filters.driverName.toLowerCase())
      );
    }
    if (filters.tripType) {
      result = result.filter(item => 
        item.TRIPTYPE && item.TRIPTYPE.toLowerCase().includes(filters.tripType.toLowerCase())
      );
    }
    
    setFilteredData(result);
  }, [contactData, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      date: '',
      empId: '',
      driverName: '',
      tripType: ''
    });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10) * day % 10];
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).replace(/\d+/, day + suffix);
  };

  // Helper function to format time in Indian format (12-hour with AM/PM)
  const formatTime = (timeValue) => {
    if (!timeValue) return '-';
    
    let hours, minutes;
    
    // Check if it's an ISO date string (from Google Sheets)
    if (timeValue.includes('T')) {
      const date = new Date(timeValue);
      if (isNaN(date)) return timeValue;
      hours = date.getUTCHours();
      minutes = date.getUTCMinutes();
    } 
    // Check if it's already in HH:MM format
    else if (timeValue.includes(':')) {
      const parts = timeValue.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
    } else {
      return timeValue;
    }
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Handle midnight (0) and noon (12)
    
    // Format minutes with leading zero if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${hours}:${formattedMinutes} ${period}`;
  };

  // Helper function to safely display data
  const displayValue = (value) => {
    return value || '-';
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loader" style={{ color:'#000D6B',fontSize:'20px',margin:'50px'}}>Please Wait Data is Loading...</div>
      ) : (
        <>
          <div className="filters-container" style={{ margin: '20px 0', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="form-control"
              style={{ maxWidth: '180px' }}
            />
            <input
              type="text"
              name="empId"
              placeholder="Filter by Emp ID"
              value={filters.empId}
              onChange={handleFilterChange}
              className="form-control"
              style={{ maxWidth: '150px' }}
            />
            <input
              type="text"
              name="driverName"
              placeholder="Filter by Driver Name"
              value={filters.driverName}
              onChange={handleFilterChange}
              className="form-control"
              style={{ maxWidth: '180px' }}
            />
            <select
              name="tripType"
              value={filters.tripType}
              onChange={handleFilterChange}
              className="form-control"
              style={{ maxWidth: '150px' }}
            >
              <option value="">All Trip Types</option>
              <option value="PU">PU (Pick-Up)</option>
              <option value="DO">DO (Drop-Off)</option>
              <option value="PU/DO">PU/DO (Both)</option>
            </select>
            <button 
              onClick={handleClearFilters}
              className="btn btn-secondary"
              style={{ 
                padding: '6px 12px',
                backgroundColor: '#000D6B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>

          {(filteredData.length > 0 ? (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="table table-bordered table-hover" style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                <thead className="thead-dark">
                  <tr>
                    <th scope="col" className="header-cell">DATE</th>
                    <th scope="col" className="header-cell">TRIP ID</th>
                    <th scope="col" className="header-cell">CAB NO</th>
                    <th scope="col" className="header-cell">VENDOR</th>
                    <th scope="col" className="header-cell">DRIVER</th>
                    <th scope="col" className="header-cell">DRIVER MOBILE</th>
                    <th scope="col" className="header-cell">ESCORT</th>
                    <th scope="col" className="header-cell">ESCORT ID/MOBILE</th>
                    <th scope="col" className="header-cell">EMPLOYEE</th>
                    <th scope="col" className="header-cell">EMP ID</th>
                    <th scope="col" className="header-cell">TRIP TYPE</th>
                    <th scope="col" className="header-cell">PICKUP LOC</th>
                    <th scope="col" className="header-cell">PICKUP TIME</th>
                    <th scope="col" className="header-cell">PICKUP KM</th>
                    <th scope="col" className="header-cell">DROPOFF LOC</th>
                    <th scope="col" className="header-cell">DROPOFF TIME</th>
                    <th scope="col" className="header-cell">DROPOFF KM</th>
                    <th scope="col" className="header-cell">TOTAL KM</th>
                    <th scope="col" className="header-cell">SHIFT</th>
                    <th scope="col" className="header-cell">GPS</th>
                    <th scope="col" className="header-cell">DELAY</th>
                    <th scope="col" className="header-cell">REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                      <td>{formatDate(record.DATE)}</td>
                      <td>{displayValue(record.TRIPID)}</td>
                      <td>{displayValue(record.CABNO)}</td>
                      <td>{displayValue(record.VENDORNAME)}</td>
                      <td>{displayValue(record.DRIVERNAME)}</td>
                      <td>{displayValue(record.DRIVERMOBILE)}</td>
                      <td>{displayValue(record.ESCORTNAME)}</td>
                      <td>{displayValue(record.ESCORTIDMOBILE)}</td>
                      <td>{displayValue(record.EMPLOYEENAME)}</td>
                      <td>{displayValue(record.EMPID)}</td>
                      <td><span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        backgroundColor: record.TRIPTYPE === 'PU' ? '#e3f2fd' : record.TRIPTYPE === 'DO' ? '#fff3e0' : '#e8f5e9',
                        color: record.TRIPTYPE === 'PU' ? '#1565c0' : record.TRIPTYPE === 'DO' ? '#ef6c00' : '#2e7d32'
                      }}>{displayValue(record.TRIPTYPE)}</span></td>
                      <td>{displayValue(record.PICKUPLOCATION)}</td>
                      <td>{formatTime(record.PICKUPTIME)}</td>
                      <td>{displayValue(record.PICKUPMETERREADING)}</td>
                      <td>{displayValue(record.DROPOFFLOCATION)}</td>
                      <td>{formatTime(record.DROPOFFTIME)}</td>
                      <td>{displayValue(record.DROPOFFMETERREADING)}</td>
                      <td style={{ fontWeight: 'bold', color: '#000D6B' }}>{displayValue(record.TOTALKM)}</td>
                      <td>{displayValue(record.SHIFTTIMING)}</td>
                      <td><span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        backgroundColor: record.GPSENABLED === 'Y' ? '#c8e6c9' : '#ffcdd2',
                        color: record.GPSENABLED === 'Y' ? '#2e7d32' : '#c62828'
                      }}>{displayValue(record.GPSENABLED)}</span></td>
                      <td><span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        backgroundColor: record.DELAY === 'Y' ? '#ffcdd2' : '#c8e6c9',
                        color: record.DELAY === 'Y' ? '#c62828' : '#2e7d32'
                      }}>{displayValue(record.DELAY)}</span></td>
                      <td>{displayValue(record.REMARKS)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No matching records found.</p>
          ))}
        </>
      )}
    </div>
  );
}

export default DriverCabDetailsAccess;
