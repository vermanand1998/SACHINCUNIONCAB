import React from "react";
import "../../styles/our-member.css";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import companyLogo01 from "../../assets/all-images/rfos.jpeg";
import companyLogo02 from "../../assets/all-images/carnationInfoTechlogo.png";
import companyLogo03 from "../../assets/all-images/pcggroup.png";
import companyLogo04 from "../../assets/all-images/entigrity.jpeg";
import companyLogo05 from "../../assets/all-images/madhu.jpg";
import companyLogo06 from "../../assets/all-images/eclat-logo.jpeg";
import "../../styles/global.css"
const OUR__CLINETS = [
  {
    name: "GOVERNMENT SECTOR",
    experience: "Regional Food Research & Analysis Centre, Lucknow",
    websiteurl: "https://uphorticulture.gov.in/site/writereaddata/siteContent/202110121618380401Empanelment_121021.pdf",
    imgUrl: companyLogo01,
  },

  {
    name: "PRIVATE SECTOR",
    experience: "Premium Customer IT Services Limited, Lucknow",
    websiteurl: "https://pcsgroup.in/",
    imgUrl: companyLogo03,
  },

  {
    name: "PRIVATE SECTOR",
    experience: "Carnation Infotech Pvt. Ltd., Lucknow",
    websiteurl: "https://www.carnationinfotech.com/",
    imgUrl: companyLogo02,
  },

  {
    name: "PRIVATE SECTOR",
    experience: "Entigrity Offshore Services LLP, Lucknow (Head office:Ahmedabad, Gujarat)",
    websiteurl: "https://www.entigrity.com/careers-details?i=MTQ=&s=MQ==",
    imgUrl: companyLogo04,
  },
  {
    name: "PRIVATE SECTOR",
    experience: "Madhu Engineering Services, Lucknow",
    websiteurl: "https://www.facebook.com/madhuengineeringservices/",
    imgUrl: companyLogo05,
  },
  {
    name: "PRIVATE SECTOR",
    experience: "ECLAT Health Solutions, Lucknow",
    websiteurl: "#",
    imgUrl: companyLogo06,
  },
];

const OurClients = () => {
  return (
    <>
      {OUR__CLINETS.map((item, index) => (
        <Col key={index} lg="4" md="6" sm="6" xs="12" className="mb-4">
          <div className="client__card">
            <div className="client__card-img">
              <a href={item.websiteurl} target="_blank" rel="noopener noreferrer">
                <img src={item.imgUrl} alt={item.name} />
              </a>
            </div>
            <div className="client__card-content">
              <span className="client__badge">{item.name}</span>
              <p className="client__description">{item.experience}</p>
            </div>
          </div>
        </Col>
      ))}
    </>
  );
};

export default OurClients;
