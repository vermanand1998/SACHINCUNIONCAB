import React, { useState } from "react";
import { Form, FormGroup, Button, Spinner } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {googleSheetUrl} from "../urlandKeys"
import "../../src/styles/global.css";
const CabDetailsForm = () => {
  const [formData, setFormData] = useState({
    SRNO: Math.floor(Math.random() * 10000) + 1,
    DATE: new Date().toISOString().split('T')[0],
    EMPCODE: "",
    EMPLOYEENAME: "",
    DROPLOCATION: "",
    DRIVERNAME: "",
    STARTINGKM: "",
    ENDKM: "",
    TOTAL: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'EMPLOYEENAME' || name === 'DRIVERNAME') {
      if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      }
      return;
    }
    
    if (name === 'STARTINGKM' || name === 'ENDKM') {
      const startKM = name === 'STARTINGKM' ? Number(value) : Number(formData.STARTINGKM);
      const endKM = name === 'ENDKM' ? Number(value) : Number(formData.ENDKM);
      
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        TOTAL: endKM && startKM ? (endKM - startKM).toString() : ""
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Create FormData with all form fields
    const formDataObject = new FormData();
    formDataObject.append('SRNO', formData.SRNO);
    formDataObject.append('DATE', formData.DATE);
    formDataObject.append('EMPCODE', formData.EMPCODE);
    formDataObject.append('EMPLOYEENAME', formData.EMPLOYEENAME);
    formDataObject.append('DROPLOCATION', formData.DROPLOCATION);
    formDataObject.append('DRIVERNAME', formData.DRIVERNAME);
    formDataObject.append('STARTINGKM', formData.STARTINGKM);
    formDataObject.append('ENDKM', formData.ENDKM);
    formDataObject.append('TOTAL', formData.TOTAL);
    
    try {
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: formDataObject,
      });

      if (response.ok) {
        toast.success('Cab Details Sent Successfully!');
        // Reset form
        setFormData({
          SRNO: Math.floor(Math.random() * 10000) + 1,
          DATE: new Date().toISOString().split('T')[0],
          EMPCODE: "",
          EMPLOYEENAME: "",
          DROPLOCATION: "",
          DRIVERNAME: "",
          STARTINGKM: "",
          ENDKM: "",
          TOTAL: "",
        });
      } else {
        toast.error('Request failed: ' + response.statusText);
      }
    } catch (error) {
      toast.error('Error submitting form: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new function to check if form is valid
  const isFormValid = () => {
    return (
      formData.DATE &&
      formData.EMPCODE &&
      formData.EMPLOYEENAME &&
      formData.DROPLOCATION &&
      formData.DRIVERNAME &&
      formData.STARTINGKM &&
      formData.ENDKM &&
      formData.TOTAL
    );
  };

  return (
    <>
      <CommonSection title="Cab Details" />
      <Form className="marginFormArround" onSubmit={handleSubmit}>
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="srNo">Sr No:</label>
          <input
            type="number"
            id="srNo"
            name="SRNO"
            value={formData.SRNO}
            disabled
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="DATE"
            value={formData.DATE}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="empCode">Employee Code:</label>
          <input
            type="text"
            id="empCode"
            name="EMPCODE"
            value={formData.EMPCODE}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="employeeName">Employee Name:</label>
          <input
            type="text"
            id="employeeName"
            name="EMPLOYEENAME"
            value={formData.EMPLOYEENAME}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="dropLocation">Drop Location:</label>
          <input
            type="text"
            id="dropLocation"
            name="DROPLOCATION"
            value={formData.DROPLOCATION}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="driverName">Driver Name:</label>
          <input
            type="text"
            id="driverName"
            name="DRIVERNAME"
            value={formData.DRIVERNAME}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="startingKM">Starting KM:</label>
          <input
            type="number"
            id="startingKM"
            name="STARTINGKM"
            value={formData.STARTINGKM}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="endKM">End KM:</label>
          <input
            type="number"
            id="endKM"
            name="ENDKM"
            value={formData.ENDKM}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="total">Total:</label>
          <input
            type="number"
            id="total"
            name="TOTAL"
            value={formData.TOTAL}
            readOnly
          />
        </FormGroup>

        <FormGroup>
          <Button 
            type="submit" 
            style={{
              backgroundColor: isFormValid() ? '#000D6B' : '#808080',
              cursor: isFormValid() ? 'pointer' : 'not-allowed'
            }}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="me-2">
                  Loading...
                </Spinner>
                Submitting...
              </>
            ) : (
              'Submit Cab Details'
            )}
          </Button>
        </FormGroup>
      </Form>
    </>
  );
};

export default CabDetailsForm;
