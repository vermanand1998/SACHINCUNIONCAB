import React, { useState } from "react";
import { Form, FormGroup, Button, Spinner } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {googleSheetUrl} from "../urlandKeys"
import "../../src/styles/global.css";

// Driver and Cab Data
const driversData = [
  { id: 1, cabNo: "CAB-001", driverName: "SIDDHARTH", driverMobile: "9876543210", vendorName: "Union Services" },
  { id: 2, cabNo: "CAB-002", driverName: "RAHUL", driverMobile: "9876543211", vendorName: "Union Services" },
  { id: 3, cabNo: "CAB-003", driverName: "FAIZ KHAN", driverMobile: "9876543212", vendorName: "Union Services" },
];

const CabDetailsForm = () => {
  // Generate Trip ID
  const generateTripId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TRP${year}${month}${day}${random}`;
  };

  const [formData, setFormData] = useState({
    DATE: new Date().toISOString().split('T')[0],
    TRIPID: generateTripId(),
    CABNO: "",
    VENDORNAME: "",
    DRIVERNAME: "",
    DRIVERMOBILE: "",
    ESCORTNAME: "",
    ESCORTIDMOBILE: "",
    EMPLOYEENAME: "",
    EMPID: "",
    TRIPTYPE: "",
    PICKUPLOCATION: "",
    PICKUPTIME: "",
    PICKUPMETERREADING: "",
    DROPOFFLOCATION: "",
    DROPOFFTIME: "",
    DROPOFFMETERREADING: "",
    TOTALKM: "",
    SHIFTTIMING: "",
    GPSENABLED: "",
    DELAY: "",
    REMARKS: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDriverChange = (e) => {
    const selectedDriverId = e.target.value;
    if (selectedDriverId === "") {
      setFormData(prevData => ({
        ...prevData,
        CABNO: "",
        VENDORNAME: "",
        DRIVERNAME: "",
        DRIVERMOBILE: "",
      }));
      return;
    }
    
    const selectedDriver = driversData.find(driver => driver.id === parseInt(selectedDriverId));
    if (selectedDriver) {
      setFormData(prevData => ({
        ...prevData,
        CABNO: selectedDriver.cabNo,
        VENDORNAME: selectedDriver.vendorName,
        DRIVERNAME: selectedDriver.driverName,
        DRIVERMOBILE: selectedDriver.driverMobile,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow letters and spaces for name fields
    if (name === 'EMPLOYEENAME' || name === 'ESCORTNAME') {
      if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      }
      return;
    }
    
    // Calculate Total KM when meter readings change
    if (name === 'PICKUPMETERREADING' || name === 'DROPOFFMETERREADING') {
      const pickupKM = name === 'PICKUPMETERREADING' ? Number(value) : Number(formData.PICKUPMETERREADING);
      const dropoffKM = name === 'DROPOFFMETERREADING' ? Number(value) : Number(formData.DROPOFFMETERREADING);
      
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        TOTALKM: dropoffKM && pickupKM ? (dropoffKM - pickupKM).toString() : ""
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
    
    // Create FormData with all form fields (matching spreadsheet columns)
    const formDataObject = new FormData();
    formDataObject.append('DATE', formData.DATE);
    formDataObject.append('TRIPID', formData.TRIPID);
    formDataObject.append('CABNO', formData.CABNO);
    formDataObject.append('VENDORNAME', formData.VENDORNAME);
    formDataObject.append('DRIVERNAME', formData.DRIVERNAME);
    formDataObject.append('DRIVERMOBILE', formData.DRIVERMOBILE);
    formDataObject.append('ESCORTNAME', formData.ESCORTNAME);
    formDataObject.append('ESCORTIDMOBILE', formData.ESCORTIDMOBILE);
    formDataObject.append('EMPLOYEENAME', formData.EMPLOYEENAME);
    formDataObject.append('EMPID', formData.EMPID);
    formDataObject.append('TRIPTYPE', formData.TRIPTYPE);
    formDataObject.append('PICKUPLOCATION', formData.PICKUPLOCATION);
    formDataObject.append('PICKUPTIME', formData.PICKUPTIME);
    formDataObject.append('PICKUPMETERREADING', formData.PICKUPMETERREADING);
    formDataObject.append('DROPOFFLOCATION', formData.DROPOFFLOCATION);
    formDataObject.append('DROPOFFTIME', formData.DROPOFFTIME);
    formDataObject.append('DROPOFFMETERREADING', formData.DROPOFFMETERREADING);
    formDataObject.append('TOTALKM', formData.TOTALKM);
    formDataObject.append('SHIFTTIMING', formData.SHIFTTIMING);
    formDataObject.append('GPSENABLED', formData.GPSENABLED);
    formDataObject.append('DELAY', formData.DELAY);
    formDataObject.append('REMARKS', formData.REMARKS);
    
    try {
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: formDataObject,
      });

      if (response.ok) {
        toast.success('Cab Details Sent Successfully!');
        // Reset form
        setFormData({
          DATE: new Date().toISOString().split('T')[0],
          TRIPID: generateTripId(),
          CABNO: "",
          VENDORNAME: "",
          DRIVERNAME: "",
          DRIVERMOBILE: "",
          ESCORTNAME: "",
          ESCORTIDMOBILE: "",
          EMPLOYEENAME: "",
          EMPID: "",
          TRIPTYPE: "",
          PICKUPLOCATION: "",
          PICKUPTIME: "",
          PICKUPMETERREADING: "",
          DROPOFFLOCATION: "",
          DROPOFFTIME: "",
          DROPOFFMETERREADING: "",
          TOTALKM: "",
          SHIFTTIMING: "",
          GPSENABLED: "",
          DELAY: "",
          REMARKS: "",
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

  // Check if required form fields are valid
  const isFormValid = () => {
    return (
      formData.DATE &&
      formData.TRIPID &&
      formData.CABNO &&
      formData.DRIVERNAME &&
      formData.EMPLOYEENAME &&
      formData.EMPID &&
      formData.TRIPTYPE &&
      formData.PICKUPLOCATION &&
      formData.PICKUPTIME &&
      formData.PICKUPMETERREADING &&
      formData.DROPOFFLOCATION &&
      formData.DROPOFFTIME &&
      formData.DROPOFFMETERREADING &&
      formData.SHIFTTIMING &&
      formData.GPSENABLED &&
      formData.DELAY
    );
  };

  return (
    <>
      <CommonSection title="Cab Details" />
      <Form className="marginFormArround" onSubmit={handleSubmit}>
        {/* Row 1: Date & Trip ID */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
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

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="tripId">Trip ID:</label>
          <input
            type="text"
            id="tripId"
            name="TRIPID"
            value={formData.TRIPID}
            readOnly
            style={{ backgroundColor: '#e9ecef' }}
          />
        </FormGroup>

        {/* Row 2: Select Driver/Cab & Cab No */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="selectDriver">Select Driver/Cab:</label>
          <select
            id="selectDriver"
            name="SELECTDRIVER"
            onChange={handleDriverChange}
            required
          >
            <option value="">-- Select Driver --</option>
            {driversData.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.cabNo} - {driver.driverName}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="cabNo">Cab No.:</label>
          <input
            type="text"
            id="cabNo"
            name="CABNO"
            value={formData.CABNO}
            readOnly
            placeholder="Auto-filled"
            style={{ backgroundColor: '#e9ecef' }}
          />
        </FormGroup>

        {/* Row 3: Vendor Name & Driver Name */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="vendorName">Vendor Name:</label>
          <input
            type="text"
            id="vendorName"
            name="VENDORNAME"
            value={formData.VENDORNAME}
            readOnly
            placeholder="Auto-filled"
            style={{ backgroundColor: '#e9ecef' }}
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="driverName">Driver Name:</label>
          <input
            type="text"
            id="driverName"
            name="DRIVERNAME"
            value={formData.DRIVERNAME}
            readOnly
            placeholder="Auto-filled"
            style={{ backgroundColor: '#e9ecef' }}
          />
        </FormGroup>

        {/* Row 4: Driver Mobile & Escort Name */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="driverMobile">Driver Mobile:</label>
          <input
            type="text"
            id="driverMobile"
            name="DRIVERMOBILE"
            value={formData.DRIVERMOBILE}
            readOnly
            placeholder="Auto-filled"
            style={{ backgroundColor: '#e9ecef' }}
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="escortName">Escort Name:</label>
          <input
            type="text"
            id="escortName"
            name="ESCORTNAME"
            value={formData.ESCORTNAME}
            onChange={handleInputChange}
            placeholder="Enter escort name (optional)"
          />
        </FormGroup>

        {/* Row 5: Escort ID/Mobile & Employee Name */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="escortIdMobile">Escort ID / Mobile:</label>
          <input
            type="text"
            id="escortIdMobile"
            name="ESCORTIDMOBILE"
            value={formData.ESCORTIDMOBILE}
            onChange={handleInputChange}
            placeholder="Enter escort ID or mobile (optional)"
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
            placeholder="Enter employee name"
            required
          />
        </FormGroup>

        {/* Row 6: Emp ID & Trip Type */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="empId">Emp ID:</label>
          <input
            type="text"
            id="empId"
            name="EMPID"
            value={formData.EMPID}
            onChange={handleInputChange}
            placeholder="Enter employee ID"
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="tripType">Trip Type (PU/DO):</label>
          <select
            id="tripType"
            name="TRIPTYPE"
            value={formData.TRIPTYPE}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select Trip Type --</option>
            <option value="PU">PU (Pick-Up)</option>
            <option value="DO">DO (Drop-Off)</option>
            <option value="PU/DO">PU/DO (Both)</option>
          </select>
        </FormGroup>

        {/* Row 7: Pick-Up Location & Pick-Up Time */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="pickupLocation">Pick-Up Location:</label>
          <input
            type="text"
            id="pickupLocation"
            name="PICKUPLOCATION"
            value={formData.PICKUPLOCATION}
            onChange={handleInputChange}
            placeholder="Enter pick-up location"
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="pickupTime">Pick-Up Time:</label>
          <input
            type="time"
            id="pickupTime"
            name="PICKUPTIME"
            value={formData.PICKUPTIME}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        {/* Row 8: Pick-Up Meter Reading & Drop-Off Location */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="pickupMeterReading">Pick-Up Meter Reading (KM):</label>
          <input
            type="number"
            id="pickupMeterReading"
            name="PICKUPMETERREADING"
            value={formData.PICKUPMETERREADING}
            onChange={handleInputChange}
            placeholder="Enter pick-up KM"
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="dropoffLocation">Drop-Off Location:</label>
          <input
            type="text"
            id="dropoffLocation"
            name="DROPOFFLOCATION"
            value={formData.DROPOFFLOCATION}
            onChange={handleInputChange}
            placeholder="Enter drop-off location"
            required
          />
        </FormGroup>

        {/* Row 9: Drop-Off Time & Drop-Off Meter Reading */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="dropoffTime">Drop-Off Time:</label>
          <input
            type="time"
            id="dropoffTime"
            name="DROPOFFTIME"
            value={formData.DROPOFFTIME}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="dropoffMeterReading">Drop-Off Meter Reading (KM):</label>
          <input
            type="number"
            id="dropoffMeterReading"
            name="DROPOFFMETERREADING"
            value={formData.DROPOFFMETERREADING}
            onChange={handleInputChange}
            placeholder="Enter drop-off KM"
            required
          />
        </FormGroup>

        {/* Row 10: Total KM & Shift Timing */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="totalKm">Total KM:</label>
          <input
            type="number"
            id="totalKm"
            name="TOTALKM"
            value={formData.TOTALKM}
            readOnly
            placeholder="Auto-calculated"
            style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="shiftTiming">Shift Timing:</label>
          <select
            id="shiftTiming"
            name="SHIFTTIMING"
            value={formData.SHIFTTIMING}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select Shift --</option>
            <option value="Morning (6AM - 2PM)">Morning (6AM - 2PM)</option>
            <option value="Afternoon (2PM - 10PM)">Afternoon (2PM - 10PM)</option>
            <option value="Night (10PM - 6AM)">Night (10PM - 6AM)</option>
            <option value="General (9AM - 6PM)">General (9AM - 6PM)</option>
            <option value="Full Day">Full Day</option>
          </select>
        </FormGroup>

        {/* Row 11: GPS Enabled & Delay */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="gpsEnabled">GPS Enabled (Y/N):</label>
          <select
            id="gpsEnabled"
            name="GPSENABLED"
            value={formData.GPSENABLED}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select --</option>
            <option value="Y">Y (Yes)</option>
            <option value="N">N (No)</option>
          </select>
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="delay">Delay (Y/N):</label>
          <select
            id="delay"
            name="DELAY"
            value={formData.DELAY}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select --</option>
            <option value="Y">Y (Yes)</option>
            <option value="N">N (No)</option>
          </select>
        </FormGroup>

        {/* Row 12: Remarks */}
        <FormGroup className="booking__form d-inline-block me-4 mb-4" style={{ width: '100%', maxWidth: '600px' }}>
          <label htmlFor="remarks">Remarks:</label>
          <input
            type="text"
            id="remarks"
            name="REMARKS"
            value={formData.REMARKS}
            onChange={handleInputChange}
            placeholder="Any additional notes (optional)"
            style={{ width: '100%' }}
          />
        </FormGroup>

        {/* Submit Button */}
        <FormGroup>
          <Button 
            type="submit" 
            style={{
              backgroundColor: isFormValid() ? '#000D6B' : '#808080',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: '600'
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
