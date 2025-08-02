import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function VendorRegisterGuard({ children }) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  if (!userInfo) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }
  if (userInfo && userInfo.isVendor) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
