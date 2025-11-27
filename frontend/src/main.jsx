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

import AboutUs from "./pages/User/AboutUs.jsx";
import ContactUs from "./pages/User/ContactUs.jsx";
import FAQ from "./pages/User/FAQ.jsx";

import OrderList from "./components/Admin/OrderList.jsx";
import UploadPageTest from "./pages/Vendor/UploadPageTest.jsx";
import VendorProducts from "./pages/Vendor/ProductTools/VendorProducts.jsx";
import VendorRoutes from "./components/Vendor/VendorRoutes.jsx";
import Profile from "./pages/User/Profile.jsx";
import UpdateProfile from "./pages/User/UpdateProfile.jsx";
import VendorRegister from "./pages/Vendor/VendorRegister.jsx";
import VendorRegisterGuard from "./pages/Vendor/VendorRegisterGuard.jsx";

import ProductOverView from "./pages/Home/ProductTools/ProductOverview.jsx";
import Home from "./pages/Home/Home.jsx";

import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import UserUpdate from "./pages/Admin/UserUpdate.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import ManageOrders from "./pages/Admin/ManageOrders.jsx";
import AdminRoute from "./components/Admin/AdminRoute.jsx";
import Unauthorized from "./pages/User/Unauthorized.jsx";
import ProductList from "./components/Product/ProductList.jsx";
import UserList from "./pages/Admin/UserList.jsx";

import { UserProvider } from "./components/UserProvider";
import CartPage from "./pages/User/Cart/CartPage.jsx";
import Checkout from "./pages/User/Checkout.jsx";
import Products from "./pages/Home/ProductTools/Products.jsx";
import ProductCard from "./TestComponents/ProductGridCardTest.jsx";
import MyOrders from "./pages/User/Orders/MyOrders.jsx";
import CategoryManagement from "./components/Admin/CategoryManagement.jsx";
import VendorLayout from "./components/Vendor/VendorLayout.jsx";

import PaymentComponent from "./pages/Transaction/Payment.jsx";
import Success from "./pages/Transaction/Success.jsx";
import Failure from "./pages/Transaction/Failure.jsx"
import OrderManagement from "./pages/Vendor/OrderManagement.jsx";
import CustomerOrderDashboard from "./TestComponents/TestComponent.jsx";
import BlackListedProducts from "./components/Admin/BlackListedProducts.jsx";
import VendorDashboard from "./pages/Vendor/VendorDashboard.jsx";
import Category from "./pages/Home/Category.jsx";
import OrderInfo from "./pages/User/Orders/OrderInfo.jsx";
import OrderCheckUp from "./pages/Delivery/OrderCheckUp.jsx";
import VendorPayments from "./pages/Admin/VendorPayments.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    // ________________________________ GUEST ________________________________________
    <Route
      path="/"
      element={<App />}
      errorElement={
        <div className="min-h-screen flex items-center justify-center bg-[#0a1120] text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-[#1de9b6]">
              404 - Page Not Found
            </h1>
            <p className="text-lg">
              Sorry, the page you are looking for does not exist.
            </p>
            <a
              href="/"
              className="mt-4 inline-block px-6 py-2 bg-[#1de9b6] text-[#0a1120] rounded-lg font-semibold"
            >
              Go Home
            </a>
          </div>
        </div>
      }
    >
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/products" element={<Products />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/overview/:productId" element={<ProductOverView />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/tester" element={<ProductCard />} />
      <Route path="/testcomponent" element={<CustomerOrderDashboard />} />
      <Route path="/categories" element={<Category />} />

      {/* ________________________________ VENDOR ________________________________________*/}

      <Route element={<VendorRoutes />}>
        <Route path="/vendor" element={<VendorLayout />}>
          <Route path="dashboard" element={<VendorDashboard/>} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="upload" element={<UploadPageTest />} />
          <Route path="order-management" element={<OrderManagement />} />
        </Route>
      </Route>

      {/* Vendor route guard: if already a vendor, redirect to dashboard */}
      <Route
        path="/vendor/register"
        element={
          <VendorRegisterGuard>
            <VendorRegister />
          </VendorRegisterGuard>
        }
      />

      {/* ________________________________ LOGGED IN ________________________________________*/}

      <Route path="/" element={<PrivateRoute />}>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/vendor" element={<VendorRegister />} />

        <Route path="/delivery-orders-checkup" element={<OrderCheckUp />} />
        {/* <Route path="/upload" element={<UploadPageTest />} /> */}
        <Route path="/admin/productcard" element={<ProductList />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/order/:id" element={<OrderInfo />} />

        <Route path="/payment" element={<PaymentComponent />} />
        <Route path="/payment-success" element={<Success />} />
        <Route path="/payment-failure" element={<Failure />} />
      </Route>

      {/* ________________________________ ADMIN ________________________________________*/}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="vendor-payments" element={<VendorPayments />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route
            path="blacklisted-products"
            element={<BlackListedProducts />}
          />
          <Route path="users/:id/edit" element={<UserUpdate />} />
          <Route path="categories" element={<CategoryManagement />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </Provider>
);
