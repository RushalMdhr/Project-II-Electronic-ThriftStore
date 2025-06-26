import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/User/Profile.jsx";
import UpdateProfile from "./pages/User/UpdateProfile.jsx";

import VendorRegister from "./pages/Vendor/VendorRegister.jsx";
import Home from "./pages/Home/Home.jsx";
import AboutUs from "./pages/User/AboutUs.jsx";
import ContactUs from "./pages/User/ContactUs.jsx";
import FAQ from "./pages/User/FAQ.jsx";
import Unauthorized from "./pages/User/Unauthorized.jsx";
import Upload from "./components/Product/Upload.jsx";
import ProductList from "./components/Product/ProductList.jsx";
import AdminRoute from "./components/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import OrderList from "./components/Admin/OrderList.jsx"
import UploadPage from "./pages/Vendor/UploadPage.jsx";
import UploadPageTest from "./pages/Vendor/UploadPageTest.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactUs />} />

      <Route path="/vendor/register" element={<VendorRegister />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/vendor" element={<VendorRegister />} />
        <Route path="/upload" element={<UploadPageTest />} />
        <Route path="/admin/productcard" element={<ProductList />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
          
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin/usercard" element={<UserList />} />
        <Route path="/admin/orderlist" element={<OrderList />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
