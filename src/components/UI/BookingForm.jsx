import React, { useState,useContext } from "react";
import { Form, FormGroup, Button } from "reactstrap";
import "../../styles/booking-form.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authModelContext from "../../Store/UserContext";
import {googleSheetUrl} from "../../urlandKeys"
const BookingForm = () => {
  const { setshowAuthModel } =useContext(authModelContext);
  // State to store form data
  const [formData, setFormData] = useState({
    FIRSTNAME: "",
    LASTNAME: "",
    EMAIL: "",
    MOBILE: "",
    FROMADDRESS: "",
    TOADDRESS: "",
    PERSON: "1 person",
    LUGGAGE: "1 luggage",
    JOURNEYDATE: "",
    JOURNEYTIME: "",
    MESSAGE: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData object from the form element
    const formDataObject = new FormData(e.target);

    // Log or do something with the FormData object
    console.log('Form data submitted:', formDataObject);

    // Optional: Clear the form fields after submission
    setFormData({
      FIRSTNAME: "",
      LASTNAME: "",
      EMAIL: "",
      MOBILE: "",
      FROMADDRESS: "",
      TOADDRESS: "",
      PERSON: "1 person",
      LUGGAGE: "1 luggage",
      JOURNEYDATE: "",
      JOURNEYTIME: "",
      MESSAGE: "",
    });

    // Perform additional actions, such as making an API call
    // ...
    if(localStorage.getItem("Token")==="null"){
      setshowAuthModel(true);
    }else{
      try {
        // Example: API call with fetch
        const response = await fetch(googleSheetUrl, {
          method: "POST",
          body: formDataObject,
        });
  
        // Handle the response
        if (response.ok) {
          console.log('Request was successful');
          toast.success('Booking Details Sent Successfully !', {});
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
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <input
          type="text"
          placeholder="First Name"
          name="FIRSTNAME"
          required
          value={formData.FIRSTNAME}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input
          type="text"
          placeholder="Last Name"
          name="LASTNAME"
          required
          value={formData.LASTNAME}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <input
          type="email"
          placeholder="Email"
          name="EMAIL"
          required
          value={formData.EMAIL}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input
          type="number"
          placeholder="Phone Number"
          name="MOBILE"
          required
          value={formData.MOBILE}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <input
          type="text"
          placeholder="From Address"
          name="FROMADDRESS"
          required
          value={formData.FROMADDRESS}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input
          type="text"
          placeholder="To Address"
          name="TOADDRESS"
          required
          value={formData.TOADDRESS}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <select
          name="PERSON"
          required
          value={formData.PERSON}
          onChange={handleInputChange}
        >
          <option value="1 person">1 Person</option>
          <option value="2 person">2 Person</option>
          <option value="3 person">3 Person</option>
          <option value="4 person">4 Person</option>
          <option value="5+ person">5+ Person</option>
        </select>
      </FormGroup>
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <select
          name="LUGGAGE"
          required
          value={formData.LUGGAGE}
          onChange={handleInputChange}
        >
          <option value="1 luggage">1 Luggage</option>
          <option value="2 luggage">2 Luggage</option>
          <option value="3 luggage">3 Luggage</option>
          <option value="4 luggage">4 Luggage</option>
          <option value="5+ luggage">5+ Luggage</option>
        </select>
      </FormGroup>

      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <input
          type="date"
          required
          placeholder="Journey Date"
          name="JOURNEYDATE"
          value={formData.JOURNEYDATE}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input
          type="time"
          required
          placeholder="Journey Time"
          className="time__picker"
          name="JOURNEYTIME"
          value={formData.JOURNEYTIME}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup>
        <textarea
          rows={5}
          type="textarea"
          required
          className="textarea"
          placeholder="Write"
          name="MESSAGE"
          value={formData.MESSAGE}
          onChange={handleInputChange}
        ></textarea>
      </FormGroup>

      <FormGroup>
      <div className="payment text-end mt-5">
        <Button type="submit">
          Reserve Now
        </Button>
      </div>
      </FormGroup>
    </Form>
    
  );
};

export default BookingForm;



//https://script.google.com/macros/s/AKfycbyhmIgF6PFMWkEa3a3INzsbWPBaF7Mb-D6ouaVuYLfQ7AoLfhlmP4FK4IOsVH_P16OF/exec
