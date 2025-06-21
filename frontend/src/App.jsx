import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/base/Navbar";
import Footer from "./components/base/Footer";

function App() {
  return (
    <>
      <ToastContainer/>
      <Navbar/>
      <main className="py-3">
        <Outlet/>
      </main>
      <Footer/>
    </>
  );
}

export default App;
