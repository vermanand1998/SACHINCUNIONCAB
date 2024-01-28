import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { googleSheetUrl } from '../urlandKeys';
import './adminPortal'; // Import your CSS file for styling

function DriverCabDetailsAccess() {
  const [contactData, setContactData] = useState([]);
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

  return (
    <div className="container">
      {loading ? (
        <div className="loader" style={{ color:'#000D6B',fontSize:'20px',margin:'50px'}}>Please Wait Data is Loading...</div>
      ) : contactData.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col" className="header-cell">CARNUMBER</th>
                <th scope="col" className="header-cell">CLOSINGREADING</th>
                <th scope="col" className="header-cell">DATE</th>
                <th scope="col" className="header-cell">DRIVERID</th>
                <th scope="col" className="header-cell">DRIVERNAME</th>
                <th scope="col" className="header-cell">DROPLOCATION</th>
                <th scope="col" className="header-cell">DROPTIME</th>
                <th scope="col" className="header-cell">EMPLOYEENAME</th>
                <th scope="col" className="header-cell">EXTRAKMS</th>
                <th scope="col" className="header-cell">NIGHTHALTS</th>
                <th scope="col" className="header-cell">OPENINGREADING</th>
                <th scope="col" className="header-cell">PICKUPLOCATION</th>
                <th scope="col" className="header-cell">PICKUPTIME</th>
                <th scope="col" className="header-cell">TOTALDAYS</th>
                <th scope="col" className="header-cell">TOTALRUNKMS</th>
              </tr>
            </thead>
            <tbody>
              {contactData.map((contact, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                  <td>{contact.CARNUMBER}</td>
                  <td>{contact.CLOSINGREADING}</td>
                  <td>{contact.DATE}</td>
                  <td>{contact.DRIVERID}</td>
                  <td>{contact.DRIVERNAME}</td>
                  <td>{contact.DROPLOCATION}</td>
                  <td>{contact.DROPTIME}</td>
                  <td>{contact.EMPLOYEENAME}</td>
                  <td>{contact.EXTRAKMS}</td>
                  <td>{contact.NIGHTHALTS}</td>
                  <td>{contact.OPENINGREADING}</td>
                  <td>{contact.PICKUPLOCATION}</td>
                  <td>{contact.PICKUPTIME}</td>
                  <td>{contact.TOTALDAYS}</td>
                  <td>{contact.TOTALRUNKMS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No contact details available.</p>
      )}
    </div>
  );
}

export default DriverCabDetailsAccess;
