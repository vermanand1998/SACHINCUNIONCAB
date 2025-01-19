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
    empCode: '',
    driverName: ''
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
      result = result.filter(item => item.DATE.includes(filters.date));
    }
    if (filters.empCode) {
      result = result.filter(item => 
        item.EMPCODE.toString().toLowerCase().includes(filters.empCode.toLowerCase())
      );
    }
    if (filters.driverName) {
      result = result.filter(item => 
        item.DRIVERNAME.toLowerCase().includes(filters.driverName.toLowerCase())
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
      empCode: '',
      driverName: ''
    });
  };

  // Add this helper function inside the component
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Return original string if invalid date
    
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10) * day % 10];
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).replace(/\d+/, day + suffix);
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loader" style={{ color:'#000D6B',fontSize:'20px',margin:'50px'}}>Please Wait Data is Loading...</div>
      ) : (
        <>
          <div className="filters-container" style={{ margin: '20px 0', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="form-control"
              style={{ maxWidth: '200px' }}
            />
            <input
              type="text"
              name="empCode"
              placeholder="Filter by Employee Code"
              value={filters.empCode}
              onChange={handleFilterChange}
              className="form-control"
              style={{ maxWidth: '200px' }}
            />
            <input
              type="text"
              name="driverName"
              placeholder="Filter by Driver Name"
              value={filters.driverName}
              onChange={handleFilterChange}
              className="form-control"
              style={{ maxWidth: '200px' }}
            />
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
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col" className="header-cell">SRNO</th>
                    <th scope="col" className="header-cell">DATE</th>
                    <th scope="col" className="header-cell">EMPCODE</th>
                    <th scope="col" className="header-cell">EMPLOYEENAME</th>
                    <th scope="col" className="header-cell">DROPLOCATION</th>
                    <th scope="col" className="header-cell">DRIVERNAME</th>
                    <th scope="col" className="header-cell">STARTINGKM</th>
                    <th scope="col" className="header-cell">ENDKM</th>
                    <th scope="col" className="header-cell">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((contact, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                      <td>{contact.SRNO}</td>
                      <td>{formatDate(contact.DATE)}</td>
                      <td>{contact.EMPCODE}</td>
                      <td>{contact.EMPLOYEENAME}</td>
                      <td>{contact.DROPLOCATION}</td>
                      <td>{contact.DRIVERNAME}</td>
                      <td>{contact.STARTINGKM}</td>
                      <td>{contact.ENDKM}</td>
                      <td>{contact.TOTAL}</td>
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
