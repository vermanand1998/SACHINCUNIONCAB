import React, { useEffect } from "react";

import carData from "../assets/data/carData";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { useParams } from "react-router-dom";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import "../styles/global.css";
const CarDetails = () => {
  const { slug } = useParams();

  const singleCarItem = carData.find((item) => item.carName === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleCarItem]);
  const headingStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0",
    marginBottom: "5px",
  };

  const priceStyle = {
    margin: "0",
    marginBottom: "10px",
  };
  return (
    <Helmet title={singleCarItem.carName}>
      <section>
        <Container>
          <Row>
            <Col lg="5">
              <img src={singleCarItem.imgUrl} alt="" className="w-100" />
              <img src={singleCarItem.imgUrlSeats} alt="" className="w-100" />
            </Col>

            <Col lg="7">
              <div className="car__info">
                <h2 className="section__title">{singleCarItem.carName}</h2>
                <p className="section__description">
                  {singleCarItem.description}
                </p>
                <div className="price-table">
                  <div className="table-row">
                    {Object.keys(singleCarItem).includes("local") && (
                      <div className="table-cell">
                        <h4
                          className="heading-style"
                          style={{ color: "#000D6B" }}
                        >
                          <i class="ri-car-line"></i> Local
                        </h4>
                        {singleCarItem.local.map((item, subIndex) => (
                          <div key={subIndex} className="price-style">
                            {item.key1.map((value, innerIndex) => (
                              <div
                                key={innerIndex}
                                style={{ color: "#336600" }}
                              >
                                {" "}
                                <i className="ri-star-s-fill"></i> {value}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {Object.keys(singleCarItem).includes("outStation") && (
                      <div className="table-cell">
                        <h4
                          className="heading-style"
                          style={{ color: "#000D6B" }}
                        >
                          <i class="ri-car-line"></i> Out Station
                        </h4>
                        {singleCarItem.outStation.map((item, subIndex) => (
                          <div key={subIndex} className="price-style">
                            {item.key1.map((value, innerIndex) => (
                              <div
                                key={innerIndex}
                                style={{ color: "#336600" }}
                              >
                                <i className="ri-star-s-fill"></i> {value}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {Object.keys(singleCarItem).includes("monthly") && (
                      <div className="table-cell">
                        <h4
                          className="heading-style"
                          style={{ color: "#000D6B" }}
                        >
                          {" "}
                          <i class="ri-car-line"></i> Monthly
                        </h4>
                        {singleCarItem.monthly.map((item, subIndex) => (
                          <div key={subIndex} className="price-style">
                            {item.key1.map((value, innerIndex) => (
                              <div
                                key={innerIndex}
                                style={{ color: "#336600" }}
                              >
                                {" "}
                                <i className="ri-star-s-fill"></i> {value}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* <div className=" d-flex align-items-center gap-5 mb-4 mt-3">
                  <h6 className="rent__price fw-bold fs-4">
                    {singleCarItem.price}.00 Rupee/ Day
                  </h6>

                  <span className=" d-flex align-items-center gap-2">
                    <span style={{ color: "#f9a826" }}>
                      <i class="ri-star-s-fill"></i>
                      <i class="ri-star-s-fill"></i>
                      <i class="ri-star-s-fill"></i>
                      <i class="ri-star-s-fill"></i>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    ({singleCarItem.rating} ratings)
                  </span>
                </div> */}

                {/* <p className="section__description">
                  {singleCarItem.description}
                </p>

                <div
                  className=" d-flex align-items-center mt-3"
                  style={{ columnGap: "4rem" }}
                >
                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-roadster-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.model}
                  </span>

                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-settings-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.automatic}
                  </span>

                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-timer-flash-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.speed}
                  </span>
                </div> */}

                {/* <div
                  className=" d-flex align-items-center mt-3"
                  style={{ columnGap: "2.8rem" }}
                >
                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i class="ri-map-pin-line" style={{ color: "#f9a826" }}></i>{" "}
                    {singleCarItem.gps}
                  </span>

                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-wheelchair-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.seatType}
                  </span>

                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-building-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.brand}
                  </span>
                </div> */}
              </div>
            </Col>

            <Col lg="7" className="mt-5">
              <div className="booking-info mt-5">
                <h5 className="mb-4 fw-bold ">Booking Information</h5>
                <BookingForm />
              </div>
            </Col>

            <Col lg="5" className="mt-5">
              <div className="payment__info mt-5">
                <h5 className="mb-4 fw-bold ">Payment Information</h5>
                <PaymentMethod />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default CarDetails;
