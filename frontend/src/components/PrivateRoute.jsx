import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";

export default function PrivateRoute() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (expirationTime && new Date() > new Date(expirationTime)) {
      console.log("Token expired. Logging out.");
      dispatch(logout());
    }
  }, [dispatch]);

  console.log("User Info:", userInfo);

  return userInfo ? (
    <>
      <div style={{ padding: "10px", color: "green" }}>✅ Access granted</div>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace={true} />
  );
}




