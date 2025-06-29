// pages/CartPageWrapper.jsx
import React from "react";
import { useSelector } from "react-redux";
import CartPage from "./CartPage";

const CartPageWrapper = () => {
  const user = useSelector((state) => state.auth.userInfo); // Adjust if your slice is different
  const userId = user?._id;

  console.log("User from Redux:", user);       // ✅ should not be null
  console.log("User ID passed to CartPage:", userId); // ✅ should not be undefined

  return <CartPage userId={userId} />;
};

export default CartPageWrapper;
