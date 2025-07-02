import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/base/Navbar";
import Footer from "./components/base/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ToastContainer/>
      <Navbar/>
      <ScrollToTop />
      <main className="">
        <Outlet/>
      </main>
      <Footer/>
    </>
  );
}

export default App;
