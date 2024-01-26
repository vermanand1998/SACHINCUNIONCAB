import Layout from "./components/Layout/Layout";
import { ToastContainer } from 'react-toastify';
import UserContextProvider from './Store/UserContextProvider';
function App() {
  return (
    <UserContextProvider>
    <Layout />
    <ToastContainer />
    </UserContextProvider>

  );
}

export default App;
