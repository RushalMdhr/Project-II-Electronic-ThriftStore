import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/base/Navbar";
import Footer from "./components/base/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AuthWatcher from "./components/AuthWatcher"; // <-- import AuthWatcher

function App() {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <ScrollToTop />

      {/* This triggers the API call that checks auth status and forces logout if banned */}
      <AuthWatcher />

      <main className="">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
