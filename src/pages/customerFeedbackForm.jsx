import React, { useState } from "react";
import { Form, FormGroup, Button } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { googleSheetUrl } from "../urlandKeys";
import "../../src/styles/global.css";

const CustomerFeedbackFrom = () => {
  const [formData, setFormData] = useState({
    CUSTOMERNAME: "",
    DRIVERNAME: "",
    DATETIMERIDE: "",
    BOOKNUMBER: "",
    DRIVERBEHAVIOR: "",
    SAFTY: "",
    PUNCTUALITY: "",
    SUGGESTIONS: "",
    AGAINDRIVE: "",
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
      CUSTOMERNAME: "",
      DRIVERNAME: "",
      DATETIMERIDE: "",
      BOOKNUMBER: "",
      DRIVERBEHAVIOR: "",
      SAFTY: "",
      PUNCTUALITY: "",
      SUGGESTIONS: "",
      AGAINDRIVE: "",
    });

    try {
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: formDataObject,
      });

      if (response.ok) {
        toast.success('Your Feedback Sent Successfully!', {});
        console.log('Request was successful');
      } else {
        console.error('Request failed:', response.statusText);
        toast.success('Request failed:', response.statusText, {
          style: {
            color: 'white',
            backgroundColor: 'lightcoral',
          }
        });
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      toast.success('Error during fetch:', error, {
        style: {
          color: 'white',
          backgroundColor: 'lightcoral',
        }
      });
    }
  };

  return (
    <>
      <CommonSection title="Feedback Form" />
      <Form className="marginFormArround" onSubmit={handleSubmit}>
        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="driverId">Your Name:</label>
          <input
            type="text"
            id="driverId"
            name="CUSTOMERNAME"
            value={formData.CUSTOMERNAME}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="carNumber">Driver's Name or ID:</label>
          <input
            type="text"
            id="carNumber"
            name="DRIVERNAME"
            value={formData.DRIVERNAME}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="driverName">Date and Time of the Ride:</label>
          <input
            type="text"
            id="driverName"
            name="DATETIMERIDE"
            value={formData.DATETIMERIDE}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="employeeName">Booking/Reservation Number:</label>
          <input
            type="text"
            id="employeeName"
            name="BOOKNUMBER"
            value={formData.BOOKNUMBER}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="employeeName">Driver's Behavior:</label>
          <input
            type="text"
            id="employeeName"
            name="DRIVERBEHAVIOR"
            value={formData.DRIVERBEHAVIOR}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="employeeName">Safety:</label>
          <input
            type="text"
            id="employeeName"
            name="SAFTY"
            value={formData.SAFTY}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="employeeName">Punctuality:</label>
          <input
            type="text"
            id="employeeName"
            name="PUNCTUALITY"
            value={formData.PUNCTUALITY}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block ms-1 mb-4">
          <label htmlFor="employeeName">Suggestions for Improvement:</label>
          <input
            type="text"
            id="employeeName"
            name="SUGGESTIONS"
            value={formData.SUGGESTIONS}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup className="booking__form d-inline-block me-4 mb-4">
          <label htmlFor="employeeName">Would you use this service again?:</label>
          <input
            type="text"
            id="employeeName"
            name="AGAINDRIVE"
            value={formData.AGAINDRIVE}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Button type="submit" style={{ backgroundColor: '#000D6B' }}>Submit Your Feedback</Button>
        </FormGroup>
      </Form>
    </>
  );
};

export default CustomerFeedbackFrom;
