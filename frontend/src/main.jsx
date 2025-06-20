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
import AboutUs from "./pages/User/AboutUs.jsx";
import ContactUs from "./pages/User/AboutUs.jsx";
import Upload from "./pages/Admin/Upload.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import Home from "./pages/User/Home.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactUs />} />

      <Route path="/" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin/usercard" element={<UserList />} />
        <Route path="/admin/productcard" element={<ProductList />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
