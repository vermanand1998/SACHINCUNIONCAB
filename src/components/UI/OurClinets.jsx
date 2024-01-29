import React from "react";
import "../../styles/our-member.css";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import companyLogo01 from "../../assets/all-images/rfos.jpeg";
import companyLogo02 from "../../assets/all-images/carnationInfoTechlogo.png";
import companyLogo03 from "../../assets/all-images/pcggroup.png";
import companyLogo04 from "../../assets/all-images/entigrity.jpeg";
import companyLogo05 from "../../assets/all-images/madhu.jpg";
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
];

const OurClients = () => {
  return (
    <>
      {OUR__CLINETS.map((item, index) => (
        <Col  key={index} className="mb-4" xs="6" md="">
          <div >
            <div className="single__member-img">
            <Link to={item.websiteurl}>
              <img height={'150px'} width={'50px'} src={item.imgUrl} alt="" className="w-100 mobileHeight mobileWidth" />
            </Link>
            </div>
            <h6 className="text-center mb-0 mt-3">{item.name}</h6>
            <p className="section__description text-center">
              {item.experience}
            </p>
          </div>
        </Col>
      ))}
    </>
  );
};

export default OurClients;
