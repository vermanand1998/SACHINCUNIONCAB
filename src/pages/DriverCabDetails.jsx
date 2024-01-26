import React, { useState } from "react";
import { Form, FormGroup, Button } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {googleSheetUrl} from "../urlandKeys"
const CabDetailsForm = () => {
  const [formData, setFormData] = useState({
    DRIVERID: "",
    CARNUMBER: "",
    DRIVERNAME: "",
    EMPLOYEENAME: "",
    DATE: "",
    PICKUPLOCATION: "",
    PICKUPTIME: "",
    DROPLOCATION: "",
    DROPTIME: "",
    OPENINGREADING: "",
    CLOSINGREADING: "",
    TOTALRUNKMS: "",
    EXTRAKMS: "",
    NIGHTHALTS: "",
    TOTALDAYS: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObject = new FormData(e.target);
    console.log('Form data submitted:', formDataObject);

    setFormData({
      DRIVERID: "",
      CARNUMBER: "",
      DRIVERNAME: "",
      EMPLOYEENAME: "",
      DATE: "",
      PICKUPLOCATION: "",
      PICKUPTIME: "",
      DROPLOCATION: "",
      DROPTIME: "",
      OPENINGREADING: "",
      CLOSINGREADING: "",
      TOTALRUNKMS: "",
      EXTRAKMS: "",
      NIGHTHALTS: "",
      TOTALDAYS: "",
    });

    try {
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: formDataObject,
      });

      if (response.ok) {
        toast.success('Your Cabs Details Sent Successfully !', {});
        console.log('Request was successful');
      } else {
        console.error('Request failed:', response.statusText);
        toast.success('Request failed:', response.statusText,{
            style: {
              color: 'white',
              backgroundColor: 'lightcoral',
            }
          });
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      toast.success('Error during fetch:', error,{
        style: {
          color: 'white',
          backgroundColor: 'lightcoral',
        }
      });
    }
  };

  return (
    <>
      <CommonSection title="Cab Details" />
      <Form style={{marginLeft:'20px'}} onSubmit={handleSubmit}>
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="driverId">Driver Id:</label>
          <input
            type="text"
            id="driverId"
            name="DRIVERID"
            value={formData.DRIVERID}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="carNumber">Car Number:</label>
          <input
            type="text"
            id="carNumber"
            name="CARNUMBER"
            value={formData.CARNUMBER}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
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
          <label htmlFor="pickupLocation">Pickup Location:</label>
          <input
            type="text"
            id="pickupLocation"
            name="PICKUPLOCATION"
            value={formData.PICKUPLOCATION}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="pickupTime">Pickup Time:</label>
          <input
            type="time"
            id="pickupTime"
            name="PICKUPTIME"
            value={formData.PICKUPTIME}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
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

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="dropTime">Drop Time:</label>
          <input
            type="time"
            id="dropTime"
            name="DROPTIME"
            value={formData.DROPTIME}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="openingReading">Opening Reading:</label>
          <input
            type="number"
            id="openingReading"
            name="OPENINGREADING"
            value={formData.OPENINGREADING}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="closingReading">Closing Reading:</label>
          <input
            type="number"
            id="closingReading"
            name="CLOSINGREADING"
            value={formData.CLOSINGREADING}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="totalRunKMs">Total Run KM's:</label>
          <input
            type="number"
            id="totalRunKMs"
            name="TOTALRUNKMS"
            value={formData.TOTALRUNKMS}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="extraKMs">Extra KM's:</label>
          <input
            type="number"
            id="extraKMs"
            name="EXTRAKMS"
            value={formData.EXTRAKMS}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="nightHalts">Night Halts:</label>
          <input
            type="number"
            id="nightHalts"
            name="NIGHTHALTS"
            value={formData.NIGHTHALTS}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="totalDays">Total Number of Days:</label>
          <input
            type="number"
            id="totalDays"
            name="TOTALDAYS"
            value={formData.TOTALDAYS}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Button type="submit" style={{backgroundColor:'#000D6B'}}>Submit Your Cab Details</Button>
        </FormGroup>
      </Form>
    </>
  );
};

export default CabDetailsForm;
