import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/contact.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {googleSheetUrl} from "../urlandKeys"
const socialLinks = [
  {
    url: "#",
    icon: "ri-facebook-line",
  },
  {
    url: "#",
    icon: "ri-instagram-line",
  },
  {
    url: "#",
    icon: "ri-linkedin-line",
  },
  {
    url: "#",
    icon: "ri-twitter-line",
  },
];

const Contact = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    NAME: "",
    EMAIL: "",
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
      NAME: '',
      EMAIL: '',
      MESSAGE: '',
    });
    try {
      // Perform your API call with the FormData object
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: formDataObject,
      });
      // Handle the response, e.g., check if the request was successful
      if (response.ok) {
        console.log('Request was successful');
        toast.success('Contact Details Sent Successfully !', {});
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
    // await fetch('https://formspree.io/f/moqgjbyd', {
    //   method: 'POST',
    //   body: formDataObject,
    // });
  };

  return (
    <>
    <Helmet title="Contact">
      <CommonSection title="Contact" />
      <section>
        <Container>
          <Row>
            <Col lg="7" md="7">
              <h6 className="fw-bold mb-4">Get In Touch</h6>

              <Form onSubmit={handleSubmit}>
                <FormGroup className="contact__form">
                  <Input
                    placeholder="Your Name"
                    type="text"
                    name="NAME"
                    value={formData.NAME}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup className="contact__form">
                  <Input
                    placeholder="Email"
                    type="email"
                    name="EMAIL"
                    value={formData.EMAIL}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup className="contact__form">
                  <textarea
                    rows="5"
                    placeholder="Message"
                    className="textarea"
                    name="MESSAGE"
                    value={formData.MESSAGE}
                    onChange={handleInputChange}
                  ></textarea>
                </FormGroup>

                <button className="contact__btn" type="submit">
                  Send Message
                </button>
              </Form>
            </Col>

            <Col lg="5" md="5">
              <div className="contact__info">
                <h6 className="fw-bold">Contact Information</h6>
                <p className="section__description mb-0">
                  39, Pragati Nagar, Takrohi, Indira Nagar, Lucknow, Uttar Pradesh, India 226016
                </p>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="fs-6 mb-0">Phone:</h6>
                  <p className="section__description mb-0">
                    +919956237689, +919598232023 +919506726327(7am-6pm only)
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-0 fs-6">Email:</h6>
                  <p className="section__description mb-0">
                    unioncabsindia@gmail.com
                  </p>
                </div>

                <h6 className="fw-bold mt-4">Follow Us</h6>

                <div className="d-flex align-items-center gap-4 mt-3">
                  {socialLinks.map((item, index) => (
                    <Link
                      to={item.url}
                      key={index}
                      className="social__link-icon"
                    >
                      <i className={item.icon}></i>
                    </Link>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
    </>
  );
};

export default Contact;
