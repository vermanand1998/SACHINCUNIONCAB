import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../styles/about-section.css";
import aboutImg from "../../assets/all-images/cars-img/bmw-offer.png";

const AboutUnionCabs = ({ aboutClass }) => {
  return (
    <section
      className="about__section"
      style={
        aboutClass === "aboutPage"
          ? { marginTop: "0px" }
          : { marginTop: "0px" }
      }
    >
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="about__section-content">
              <h4 className="section__subtitle">Our Services</h4>
              <h2 className="section__title">HATCHBACK, SEDAN, PERMIUM SEDAN, SUV, MUV</h2>
              <p className="section__description">
              <b> 1 : </b> Provides cabs of all category on monthly basis rental. <br />
              <b> 2 : </b> Provides cabs of all category on daily basis rental. <br />
              <b> 3 : </b> Provides cabs of all category for local journey. <br />
              <b> 4 : </b> Provides cabs of all category for outstation journey. <br />
              <b> 5 : </b> Provides cabs of all category for airport pickup & drop. <br />
              <b> 6 : </b> Provides GPS enabled cabs for female safety with live tracking. <br />
              <b> 7 : </b> Provides cabs to government and private for their various purposes. <br />
              <b> 8 : </b> Provides cars on rent for wedding. <br />
              <b> 9 : </b> Provides Tour Packages. <br />
              <b> 10 : </b> Bulk cars on rent  <br />              
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

export default AboutUnionCabs;
