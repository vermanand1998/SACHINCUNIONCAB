import React from "react";
import "../../styles/our-member.css";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
// import ava01 from "../../assets/all-images/ava-1.jpg";
// import ava02 from "../../assets/all-images/ava-2.jpg";
// import ava03 from "../../assets/all-images/ava-3.jpg";
import ava01 from "../../assets/all-images/DeveAnand.png";
import ava02 from "../../assets/all-images/Shidharth.png";
import ava03 from "../../assets/all-images/Anand1.png";
import ava04 from "../../assets/all-images/ava-3.jpg";
const OUR__MEMBERS = [
  // {
  //   name: "Mr. Deva Nand",
  //   experience: "Senior Cab Manager (3+ years experience)",
  //   fbUrl: "#",
  //   instUrl: "#",
  //   twitUrl: "#",
  //   linkedinUrl: "#",
  //   imgUrl: ava01,
  // },

  // {
  //   name: "Mr. Siddharth Singh",
  //   experience: "Cab Manager (3+ years experience)",
  //   fbUrl: "#",
  //   instUrl: "#",
  //   twitUrl: "#",
  //   linkedinUrl: "#",
  //   imgUrl: ava02,
  // },

  {
    name: "Mr. Anand Verma",
    experience: "Freelancer/Team Leader (Full Stack Developer +5 years experience)",
    fbUrl: "#",
    instUrl: "#",
    twitUrl: "#",
    linkedinUrl: "https://www.linkedin.com/in/anand-verma-768363185/",
    websiteUrl: "https://avfreelancer.vercel.app/",
    imgUrl: ava03,
  },

  {
    name: "Mr. Aditya Nishad",
    experience: "Legal Lawyer of company",
    fbUrl: "#",
    instUrl: "#",
    twitUrl: "#",
    linkedinUrl: "#",
    imgUrl: ava04,
  },
];

const OurMembers = () => {
  return (
    <>
      {OUR__MEMBERS.map((item, index) => (
        <Col lg="3" md="3" sm="4" xs="6" key={index} className="mb-4">
          <div className="single__member">
            <div className="single__member-img">
              <img src={item.imgUrl} alt="" className="w-100" />

              <div className="single__member-social">
                <Link to={item.fbUrl}>
                  <i className="ri-facebook-line"></i>
                </Link>
                <Link to={item.twitUrl}>
                  <i className="ri-twitter-line"></i>
                </Link>

                {item.linkedinUrl && item.linkedinUrl !== "#" ? (
                  <a href={item.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <i className="ri-linkedin-line"></i>
                  </a>
                ) : (
                  <Link to={item.linkedinUrl || "#"}>
                    <i className="ri-linkedin-line"></i>
                  </Link>
                )}

                <Link to={item.instUrl}>
                  <i className="ri-instagram-line"></i>
                </Link>

                {item.websiteUrl && (
                  <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <i className="ri-global-line"></i>
                  </a>
                )}
              </div>
            </div>

            <h6 className="text-center mb-0 mt-3">
              {item.websiteUrl ? (
                <a 
                  href={item.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#000d6b', 
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#f9a826'}
                  onMouseOut={(e) => e.target.style.color = '#000d6b'}
                >
                  {item.name}
                </a>
              ) : (
                item.name
              )}
            </h6>
            <p className="section__description text-center">
              {item.websiteUrl ? (
                <a 
                  href={item.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#f9a826', 
                    textDecoration: 'none',
                    fontStyle: 'italic'
                  }}
                >
                  {item.experience}
                </a>
              ) : (
                item.experience
              )}
            </p>
          </div>
        </Col>
      ))}
    </>
  );
};

export default OurMembers;
