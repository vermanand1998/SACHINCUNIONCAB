import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { googleSheetUrl } from '../urlandKeys';
import './adminPortal'; // Import your CSS file for styling

function CustomerContactDetails() {
  const [contactData, setContactData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!dataFetched) {
          // Use FormData to avoid CORS issues with Google Apps Script
          const formData = new FormData();
          formData.append('key', 'A');
          
          const response = await fetch(googleSheetUrl, {
            method: 'POST',
            body: formData,
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
                <th scope="col" className="header-cell">NAME</th>
                <th scope="col" className="header-cell">EMAIL</th>
                <th scope="col" className="header-cell">MESSAGE</th>
              </tr>
            </thead>
            <tbody>
              {contactData.map((contact, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                  <td>{contact.NAME}</td>
                  <td>{contact.EMAIL}</td>
                  <td>{contact.MESSAGE}</td>
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

export default CustomerContactDetails;
