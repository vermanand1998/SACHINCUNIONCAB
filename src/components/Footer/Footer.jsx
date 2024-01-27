import React from "react";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

const quickLinks = [
  {
    path: "/about",
    display: "About",
  },

  {
    path: "/customerFeedbackFrom",
    display: "Feedback",
  },

  {
    path: "/cars",
    display: "Car Listing",
  },
  {
    path: "/blogs",
    display: "Blog",
  },

  {
    path: "/contact",
    display: "Contact",
  },
];

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="4" md="4" sm="12">
            <div className="logo footer__logo">
              <h1>
                <Link to="/home" className=" d-flex align-items-center gap-2">
                  <i class="ri-car-line"></i>
                  <span>
                    Union Cabs India <br /> Service
                  </span>
                </Link>
              </h1>
            </div>
            <p className="footer__logo-content">
            We assures you to provide the best services. <br /> GST NO. 09BDDPV7168P1ZG <br /> ESTABLISHMENT YEAR:2020
            </p>
          </Col>

          <Col lg="2" md="4" sm="6">
            <div className="mb-4">
              <h5 className="footer__link-title">Quick Links</h5>
              <ListGroup>
                {quickLinks.map((item, index) => (
                  <ListGroupItem key={index} className="p-0 mt-3 quick__link">
                    <Link to={item.path}>{item.display}</Link>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col lg="3" md="4" sm="6">
            <div className="mb-4">
              <h5 className="footer__link-title mb-4">Head Office</h5>
              <p className="office__info">39,Pragati Nagar, Takrohi,Indira Nagar,Lucknow,Uttar Pradesh,India 226016</p>
              <p className="office__info">Phone:+919956237689, +919598232023 +919506726327</p>

              <p className="office__info">Email: unioncabsindia@gmail.com</p>

              <p className="office__info">Office Time: 7am - 6pm</p>
            </div>
          </Col>

          <Col lg="3" md="4" sm="12">
            <div className="mb-4">
              <h5 className="footer__link-title">SPECIALIZATION</h5>
              <div className="mb-4">
              <p className="office__info">
                1. MONTHLY BASIS CAR RENTAL <br />
                2. DAILY BASIS CAR RENTAL <br />
                3. AIRPORT PICKUP & DROP OFF <br />
                4. OUTSTATION (ALL OVER INDIA) <br />
                5. LOCAL TRAVELLING <br />
                6. GPS ENABLED CABS <br />
                7. 24 HOURS SERVICES <br />
                8. PROVIDING VERFIED DRIVER <br />
                9. CAR FOR WEDDING PURPOSE
              </p>
            </div>
            </div>
          </Col>

          <Col lg="12">
            <div className="footer__bottom">
              <p className="section__description d-flex align-items-center justify-content-center gap-1 pt-4">
                <i class="ri-copyright-line"></i>Copyright {year} UNIONCABS, Developed by
                Anand Verma. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
