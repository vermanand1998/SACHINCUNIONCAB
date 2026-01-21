import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import CarListing from "../pages/CarListing";
import CarDetails from "../pages/CarDetails";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import CabDetailsForm from "../pages/DriverCabDetails";
import CustomerFeedback from "../adminPortal/custFeedbackaccess";
import AdminPortal from "../adminPortal/adminPortal";
import CabBookingDetails from "../adminPortal/userbookingaccess";
import CustomerContactDetails from "../adminPortal/usercontactaccess"
import DriverCabDetailsAccess from "../adminPortal/driverCabDetailsaccess"
import CustomerFeedbackFrom from "../pages/customerFeedbackForm"
import GPSTracking from "../pages/GPSTracking"
import JourneyHistory from "../pages/JourneyHistory"

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/cars" element={<CarListing />} />
      <Route path="/cars/:slug" element={<CarDetails />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/drivercabsdetails" element={<CabDetailsForm/>} />
      <Route path="/customerFeedback" element={<CustomerFeedback/>} />
      <Route path="/AdminPortal" element={<AdminPortal/>} />
      <Route path="/cabBookingDetails" element={<CabBookingDetails/>} />
      <Route path="/driverCabDetailsAccess" element={<DriverCabDetailsAccess/>} />
      <Route path="/customerContactDetails" element={<CustomerContactDetails/>} />
      <Route path="/customerFeedbackFrom" element={<CustomerFeedbackFrom/>} />
      <Route path="/gps-tracking" element={<GPSTracking/>} />
      <Route path="/journey-history" element={<JourneyHistory/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
