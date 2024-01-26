import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../styles/about-section.css";
import aboutImg from "../../assets/all-images/cars-img/bmw-offer.png";

const AboutSection = ({ aboutClass }) => {
  return (
    <section
      className="about__section"
      style={
        aboutClass === "aboutPage"
          ? { marginTop: "0px" }
          : { marginTop: "280px" }
      }
    >
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="about__section-content">
              <h4 className="section__subtitle">About Us</h4>
              <h2 className="section__title">Welcome to car booking service</h2>
              <p className="section__description">
              <b>Easy Booking : </b> Booking a cab with us is as simple as a few clicks. Our user-friendly interface ensures a seamless and quick booking process. <br />
              <b>Affordable Rates : </b>Enjoy competitive and transparent pricing. No hidden fees – what you see is what you pay. <br />
              <b>Wide Fleet Selection : </b> From sleek sedans to spacious SUVs, choose the vehicle that suits your needs. We have a diverse fleet to accommodate solo travelers or larger groups. <br />
              <b>Trained Drivers : </b> Your safety is our top priority. Our drivers are experienced, licensed, and undergo regular training to provide you with a secure and comfortable journey.
              </p>
              <div className="about__section-item d-flex align-items-center">
                <p className="section__description d-flex align-items-center gap-2">
                  <i class="ri-checkbox-circle-line"></i>Affordable Rates 
                </p>

                <p className="section__description d-flex align-items-center gap-2">
                  <i class="ri-checkbox-circle-line"></i> Easy Booking
                </p>
              </div>

              <div className="about__section-item d-flex align-items-center">
                <p className="section__description d-flex align-items-center gap-2">
                  <i class="ri-checkbox-circle-line"></i>Trained Drivers
                </p>

                <p className="section__description d-flex align-items-center gap-2">
                  <i class="ri-checkbox-circle-line"></i> Wide Fleet Selection
                </p>
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="about__img">
              <img src={aboutImg} alt="" className="w-100" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
