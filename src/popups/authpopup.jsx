import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import authModelContext from "../Store/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AuthPopup() {
  const { showAuthModel, setshowAuthModel } = useContext(authModelContext);
  const [login, setLogin] = useState(true);
  const [userData, setuserData] = useState();
  const [formData, setFormData] = useState({
    name: "", // Added for signup username
    email: "",
    password: "",
    appType: "ecommerce"
  });

  const handleClose = () => {
    setshowAuthModel(false);
  };

  const handleToggleForm = () => {
    setLogin((prevLogin) => !prevLogin);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);

    const url = login
      ? "https://academics.newtonschool.co/api/v1/user/login"
      : "https://academics.newtonschool.co/api/v1/user/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          projectID: "ecbv068658kc",
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      setuserData(json.data)
      localStorage.setItem("Token",json.token);
      {login ?(localStorage.setItem("UserEmail",json.data.user.email)):(localStorage.setItem("UserEmail",json.data.user.email))}
      {login ?(localStorage.setItem("Name",json.data.user.name)):(localStorage.setItem("Name",json.data.user.name))}
      window.location.reload();
      handleClose();


      if (response.ok) {
        console.log("Request was successful");
        toast.success(`${login ? "Login" : "Signup"} Successful!`);
      } else {
        console.error("Request failed:", response.statusText);
        toast.error(`Request failed: ${response.statusText}`, {
          style: {
            color: "white",
            backgroundColor: "lightcoral",
          },
        });
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error(`Please Check your Details !!`, {
        style: {
          color: "white",
          backgroundColor: "lightcoral",
        },
      });
    }
  };

  return (
    <>
      <Modal
        show={showAuthModel}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#3973ac", color: "white" }}
        >
          <Modal.Title className="text-center">
            {login ? "Login" : "Signup"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            {login ? (
              <>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>
                    <FaEnvelope className="mr-2" /> Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    required
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>
                    <FaLock className="mr-2" /> Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>
                    <FaUser className="mr-2"  /> Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter 10 char"
                    name="name"
                    required
                    maxLength={'10'}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>
                    <FaEnvelope className="mr-2" /> Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>
                    <FaLock className="mr-2" /> Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </>
            )}
            <Button
              style={{ marginTop: "20px", backgroundColor: "green" }}
              variant="primary"
              type="submit"
              block
            >
              {login ? "Login" : "Signup"}
            </Button>
            <Button
              style={{ marginTop: "20px", marginLeft: "5%", backgroundColor: "#000D6B" }}
              onClick={handleToggleForm}
            >
              {login ? "Switch to Signup" : "Switch to Login"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AuthPopup;
