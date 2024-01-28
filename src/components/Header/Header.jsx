import React, { useRef, useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import "../../styles/header.css";
import Example from "../../popups/authpopup";
import authModelContext from "../../Store/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/global.css"
const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { showAuthModel, setshowAuthModel, userToken, userName } =
    useContext(authModelContext);
  const [navLinks, setNavLinks] = useState([
    {
      path: "/home",
      display: "Home",
    },
    {
      path: "/about",
      display: "About",
    },
    {
      path: "/cars",
      display: "Cars",
    },
    {
      path: "/blogs",
      display: "Blog",
    },
    {
      path: "/contact",
      display: "Contact",
    },
    {
      path: "/customerFeedbackFrom",
      display: "Feedback",
    },
  ]);
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.length >= 3) {
      navigate("/cars");
      toast.success("Searched successfully !", {});
      setSearchQuery("");
    } else {
      // toast.success('Please Enter atleast 3 character !',{
      //   style: {
      //     color: 'white',
      //     backgroundColor: 'lightcoral',
      //   }
      // });
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.length >= 3) {
      navigate("/cars");
      toast.success("Searched successfully !", {});
    } else {
      toast.success("Please Enter atleast 3 character !", {
        style: {
          color: "white",
          backgroundColor: "lightcoral",
        },
      });
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("Token");
    const UserEmail = localStorage.getItem("UserEmail");
    setshowAuthModel(false);

    if (UserEmail!==null && UserEmail ==='uniooncabsindia2020@gmail.com' && token!==null) {
      setNavLinks((prevNavLinks) => {
        const existingCabDetailLink = prevNavLinks.find(
          (link) => link.path === "/drivercabsdetails"
        );

        // Add the Cab Detail link only if it doesn't exist in the array
        if (!existingCabDetailLink) {
          return [
            ...prevNavLinks,
            {
              path: "/drivercabsdetails",
              display: "Cab Detail",
            },
            {
              path: "/AdminPortal",
              display: "Admin Panel",
            },
          ];
        }

        return prevNavLinks;
      });
    }else if(UserEmail!==null && UserEmail ==='indiacabs2020@gmail.com' && token!==null){
      setNavLinks((prevNavLinks) => {
        const existingCabDetailLink = prevNavLinks.find(
          (link) => link.path === "/drivercabsdetails"
        );

        // Add the Cab Detail link only if it doesn't exist in the array
        if (!existingCabDetailLink) {
          return [
            ...prevNavLinks,
            {
              path: "/drivercabsdetails",
              display: "Cab Detail",
            },
          ];
        }

        return prevNavLinks;
      });
    }
  }, []);
  const openModal = (val) => {
    setshowAuthModel(true);
  };
  const logoutMe = () => {
    localStorage.setItem("Token", null);
    localStorage.setItem("UserEmail", null);
    localStorage.setItem("Name", null);
    navigate("/home");
    window.location.reload();
  };

  const menuRef = useRef(null);

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  return (
    <>
      {showAuthModel ? <Example /> : ""}
      <header className="header">
        <div className="header__top_instruction">
          <marquee direction="left" behavior="scroll" scrollamount="5">
          Our Application will be live soon. Please stay tuned and don\'t take any action. We apologize for the inconvenience.
          </marquee>
        </div>
        <span
          style={{
            display: "block",
            width: "100%",
            height: "0.3px",
            backgroundColor: "white",
          }}
        ></span>
        {/* ============ header top ============ */}
        <div className="header__top">
          <Container>
            <Row>
              <Col lg="6" md="6" sm="6">
                <div className="header__top__left showinMobOnlyCallbutton">
                  <span>Need Help?</span>
                  <span className="header__top__help">
                    <i className="ri-phone-fill"></i> +919956237689,
                    +919506726327 (7am-6pm only)
                  </span>
                </div>
              </Col>

              <Col lg="6" md="6" sm="6">
                {userToken === "null" || userToken === undefined ? (
                  <div className="header__top__right d-flex align-items-center justify-content-end gap-3">
                    <span
                      style={{marginRight:'24%'}}
                      className="showinMobOnly"
                    >
                      <div className="d-flex gap-1">
                        Welcome <b>User</b>
                      </div>
                    </span>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => openModal("Login")}
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="ri-login-circle-line"></i> Login
                    </div>

                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => openModal("Signup")}
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="ri-user-line"></i> Register
                    </div>
                  </div>
                ) : (
                  <div className="header__top__right d-flex align-items-center justify-content-end gap-3">
                    <span className="showinMobOnlyCallbutton">
                      <div className="d-flex align-items-center gap-1">
                        Welcome <b>{userName}</b>
                      </div>
                    </span>
                    <span
                      className="showinMobOnly classMarginGap"
                    >
                      <div className="d-flex gap-1">
                        Welcome <b>{userName}</b>
                      </div>
                    </span>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => logoutMe()}
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="ri-login-circle-line"></i> Logout
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </div>

        {/* =============== header middle =========== */}
        <div style={{ backgroundColor: "#ccddff" }} className="header__middle">
          <Container>
            <Row>
              <Col lg="4" md="3" sm="4">
                <div className="logo">
                  <h1>
                    <Link
                      to="/home"
                      className="d-flex align-items-center gap-2"
                    >
                      <i className="ri-car-line"></i>
                      <span className="ShowthisText">
                        Union Cabs India <br /> Service
                      </span>
                      <span className="ShowthisTextMobile">
                        Union Cabs India Service
                      </span>
                    </Link>
                  </h1>
                </div>
              </Col>

              <Col lg="3" md="3" sm="4">
                <div className="header__location d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-earth-line"></i>
                  </span>
                  <div className="header__location-content">
                    <h4>Lucknow</h4>
                    <h6>39,Pragati Nagar, Takrohi</h6>
                  </div>
                </div>
              </Col>

              <Col lg="3" md="3" sm="4">
                <div className="header__location d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-time-line"></i>
                  </span>
                  <div className="header__location-content">
                    <h4>Monday to Saturday</h4>
                    <h6>7am - 6pm</h6>
                  </div>
                </div>
              </Col>

              <Col
                lg="2"
                md="3"
                sm="0"
                className="d-flex align-items-center justify-content-end"
              >
                <button className="header__btn btn showinMobOnlyCallbutton">
                  <Link to="/contact">
                    <i className="ri-phone-line"></i> Request a call
                  </Link>
                </button>
              </Col>
            </Row>
          </Container>
        </div>

        {/* ========== main navigation =========== */}
        <div className="main__navbar">
          <Container>
            <div className="navigation__wrapper d-flex align-items-center justify-content-between">
              <span className="mobile__menu">
                <i className="ri-menu-line" onClick={toggleMenu}></i>
              </span>

              <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                <div className="menu">
                  {navLinks.map((item, index) => (
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive
                          ? "nav__active nav__item"
                          : "nav__item"
                      }
                      key={index}
                    >
                      {item.display}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress} // Add this line
                />
                <span onClick={handleSearchClick}>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </div>
          </Container>
        </div>
      </header>
    </>
  );
};

export default Header;
