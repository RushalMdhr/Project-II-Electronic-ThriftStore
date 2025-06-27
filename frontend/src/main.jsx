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
import VendorRegisterGuard from "./pages/Vendor/VendorRegisterGuard.jsx";
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

// import UploadPage from "./pages/Vendor/UploadPage.jsx";
import UploadPageTest from "./pages/Vendor/UploadPageTest.jsx";

import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import UserUpdate from "./pages/Admin/UserUpdate.jsx";
import Dashboard from "./pages/Vendor/Dashboard.jsx";
import VendorProducts from "./pages/Vendor/ProductTools/VendorProducts.jsx";
import VendorRoutes from "./components/Vendor/VendorRoutes.jsx";
import ProductOverView from "./pages/Home/ProductTools/ProductOverView.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<div className="min-h-screen flex items-center justify-center bg-[#0a1120] text-white"><div className="text-center"><h1 className="text-4xl font-bold mb-4 text-[#1de9b6]">404 - Page Not Found</h1><p className="text-lg">Sorry, the page you are looking for does not exist.</p><a href="/" className="mt-4 inline-block px-6 py-2 bg-[#1de9b6] text-[#0a1120] rounded-lg font-semibold">Go Home</a></div></div>}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/:productId" element={<ProductOverView />} />

      /* Vendor route guard: if already a vendor, redirect to dashboard */
      <Route path="/vendor/register" element={
        <VendorRegisterGuard>
          <VendorRegister />
        </VendorRegisterGuard>
      } />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Vendor-only protected routes */}
      <Route path="/vendor" element={<VendorRoutes />}>
        <Route path="products" element={<VendorProducts />} />
        <Route path="upload" element={<UploadPageTest />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users/:id/edit" element={<UserUpdate />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
