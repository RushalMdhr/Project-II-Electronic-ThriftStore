import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/base/Navbar";
import Footer from "./components/base/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AuthWatcher from "./components/AuthWatcher"; // <-- import AuthWatcher
// import { useDeleteErrorOrderMutation } from "./redux/api/orderApiSlice";
// import { useEffect } from "react";

function App() {
  // const uncheckedOrderId = localStorage.getItem("checkingOrder");
  // uncheckedOrderId &&
  //   console.log("theres an unchecked orderId", uncheckedOrderId);

  // // ✅ Move hook to top level
  // const [checkingOrders] = useDeleteErrorOrderMutation();

  // useEffect(() => {
  //   if (uncheckedOrderId) {
  //     const checkOrder = async () => {
  //       try {
  //         const res = await checkingOrders(uncheckedOrderId).unwrap(); // ✅ Added await
  //         if (!res) {
  //           return console.log("no res");
  //         } else if (res.error) {
  //           return console.log(res.error);
  //         }
  //         console.log("order removing res : ", res);
  //         localStorage.removeItem("checkingOrder");
  //       } catch (error) {
  //         console.log("error : ", error);
  //       }
  //     };
  //     checkOrder();
  //   }
  // }, [uncheckedOrderId, checkingOrders]); // ✅ Add dependency

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
