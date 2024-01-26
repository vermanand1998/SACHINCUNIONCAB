import React, { useState } from "react";
import { Form, FormGroup } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/find-car-form.css";

const FindCarForm = () => {
  const navigate = useNavigate();

  // State variables for form inputs
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [journeyTime, setJourneyTime] = useState("");
  const [carType, setCarType] = useState("ac");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clearing the form fields
    setFromAddress("");
    setToAddress("");
    setJourneyDate("");
    setJourneyTime("");
    setCarType("ac");

    // Navigate to another screen (replace "/destination" with your desired path)
    navigate("/cars");
  };

  return (
    <Form className="form" onSubmit={handleSubmit}>
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="From address"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="To address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            type="date"
            placeholder="Journey date"
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            className="journey__time"
            type="time"
            placeholder="Journey time"
            value={journeyTime}
            onChange={(e) => setJourneyTime(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="select__group">
          <select
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
          >
            <option value="ac">AC Car</option>
            <option value="non-ac">Non AC Car</option>
          </select>
        </FormGroup>

        <FormGroup className="form__group">
          <button type="submit" className="btn find__car-btn">
            Find Car
          </button>
        </FormGroup>
      </div>
    </Form>
  );
};

export default FindCarForm;
