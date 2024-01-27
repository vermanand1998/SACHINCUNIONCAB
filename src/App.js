import Layout from "./components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import UserContextProvider from "./Store/UserContextProvider";
import whatsapLogo from "./assets/all-images/whatsappLogo.png";
import callingLogo from "./assets/all-images/calling.png";
function App() {
  return (
    <>
      <UserContextProvider>
        <Layout />
        <ToastContainer />
      </UserContextProvider>
      <div
        className="fixed-bottom right-100 p-3"
        style={{
          zIndex: "100",
          left: "initial",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>
          <a
            href="tel:+9113105613"
            target="_blank"
          >
            <img
              height={"80px"}
              width={"80px"}
              src={callingLogo}
              alt="Calling"
            />
          </a>
        </div>
        <div style={{marginLeft:'16px'}}>
          <a
            href="https://wa.me/9113105613?text=How%20I%20can%20help%20you"
            target="_blank"
          >
            <img
              height={"55px"}
              width={"55px"}
              src={whatsapLogo}
              alt="WhatsApp Logo"
            />
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
