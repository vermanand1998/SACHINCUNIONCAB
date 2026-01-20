import Layout from "./components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import UserContextProvider from "./Store/UserContextProvider";
import "./styles/global.css";

function App() {
  return (
    <>
      <UserContextProvider>
        <Layout />
        <ToastContainer />
      </UserContextProvider>
      
      {/* Floating Call & WhatsApp Buttons */}
      <div className="floating-buttons">
        <a
          href="tel:9169945434"
          className="floating-btn call-btn"
          title="Call Us"
        >
          <i className="ri-phone-fill"></i>
        </a>
        <a
          href="https://wa.me/9169945434?text=Hello%20Union%20Services,%20I%20want%20to%20book%20a%20cab"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn whatsapp-btn"
          title="WhatsApp"
        >
          <i className="ri-whatsapp-fill"></i>
        </a>
      </div>
    </>
  );
}

export default App;
