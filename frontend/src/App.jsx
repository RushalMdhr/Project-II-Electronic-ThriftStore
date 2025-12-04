import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/base/Navbar";
import Footer from "./components/base/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AuthWatcher from "./components/AuthWatcher"; // <-- import AuthWatcher

function App() {
  return (
    // ✅ ADDED WRAPPER (for sticky footer)
    <div className="min-h-screen flex flex-col">
      <>
        <ToastContainer
          position="bottom-right" // or "bottom-left", "bottom-center"
          autoClose={3000}
          style={{ bottom: "10px" }} // Adjust distance from bottom
        />
        <Navbar />
        <ScrollToTop />
        {/* This triggers the API call that checks auth status and forces logout if banned */}
        <AuthWatcher />
        {/* ✅ ADDED flex-grow to push footer down */}
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </>
    </div>
  );
}

export default App;
