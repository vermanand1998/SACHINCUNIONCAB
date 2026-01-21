import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import the default styles
import './adminPortal.css'; // Import custom styles
import CustomerFeedback from "./custFeedbackaccess"
import CommonSection from '../components/UI/CommonSection';
import CabBookingDetails from "./userbookingaccess";
import CustomerContactDetails from "./usercontactaccess"
import DriverCabDetailsAccess from "./driverCabDetailsaccess"
import GPSJourneyAccess from "./gpsJourneyAccess"

function AdminPortal() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div>
      <CommonSection title="Admin Panel" />

      <Tabs
        selectedIndex={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
        className="custom-tabs-container"
      >
        <TabList className="custom-tab-list">
          <Tab className="custom-tab">Driver Details</Tab>
          <Tab className="custom-tab">GPS Journeys</Tab>
          <Tab className="custom-tab">Customer Feedback</Tab>
          <Tab className="custom-tab">Cab Booked</Tab>
          <Tab className="custom-tab">Customer Contacted</Tab>
        </TabList>

        <TabPanel>
         <DriverCabDetailsAccess/>
        </TabPanel>
        <TabPanel>
         <GPSJourneyAccess/>
        </TabPanel>
        <TabPanel>
        <CustomerFeedback/>
        </TabPanel>
        <TabPanel>
        <CabBookingDetails/>
        </TabPanel>
        <TabPanel>
          <CustomerContactDetails/>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default AdminPortal;
