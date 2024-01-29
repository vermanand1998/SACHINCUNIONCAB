import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../styles/about-section.css";
// import ava01 from "../../assets/all-images/ava-1.jpg";
import ava01 from "../../assets/all-images/Sachin.png";
import "../../styles/our-member.css";
const AboutMe = ({ aboutClass }) => {
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
              <h4 className="section__subtitle">OUR VISSION</h4>
              <p className="section__description">
                <p>
                  To promote a friendly, secured and safety transportation
                  services for the clients and build trust and confidence to
                  attain excellence of service.
                </p>
              </p>
              <h4 className="section__subtitle">OUR MISSION</h4>
              <p className="section__description">
                <p>
                  To stipulate the necessary reinforcement through provision of
                  good cars, and dedicated employees that is sensitive and
                  responsive to the needs of clients and promote quality of
                  service to enhance competitiveness.
                </p>
              </p>
              <h4 className="section__subtitle">OUR VALUES</h4>
              <p className="section__description">
                <p>
                  Our business is known for the practical rental rate choices.
                  We consider an ethical standards towards our employees and
                  clients, and focus on our client’s safety, comfort, and
                  satisfaction
                </p>
              </p>
              <h4 className="section__subtitle">WHY CHOOSE UNION CABS?</h4>
              <p className="section__description">
                <p>
                  Here at Union Cabs, we take pride in connecting people during
                  their important events in life. After all, people don’t just
                  rent vehicles for transportation but also a means for
                  accomplishing major tasks like moving to a new house or
                  providing cab to their office employees, attend special events
                  like weddings, birthdays, making your guests feel comfortable
                  or to simply enjoy quality time with loved ones. Your
                  happiness appreciates us
                </p>
              </p>
            </div>
          </Col>
          <Col lg="6" md="6">
            <Col>
              <div>
                <div
                  className="single__member-img imageMargin"
                >
                  <img height={300} width={400} src={ava01} alt="" />
                </div>

                <h6 className="text-center mb-0 mt-3">
                  <h4 className="section__subtitle">ABOUT THE PROPRIETOR</h4>
                  <p className="section__description">
                    <p>
                      Meet <b>Mr. Sachin Verma</b>, the accomplished <b>proprietor
                      of UNION CAB .</b> Armed with a background in <b>Civil
                      Engineering</b> and over <b>3 years of experience</b>, he has
                      transitioned seamlessly into entrepreneurship. As the
                      driving force behind UnionCabs India, Mr. Verma continues
                      to showcase his leadership and expertise in steering the
                      success of the business.
                    </p>
                  </p>
                </h6>
              </div>
            </Col>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutMe;
