import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const VendorRoutes = () => {
 const { userInfo } = useSelector((state) => state.auth);

  console.log("userInfo:", userInfo);

  return !userInfo ? (
    <Navigate to="/login" replace />
  ) : !userInfo.isVendor ? (
    <Navigate to="/unauthorized" replace />
  ) : (
    <Outlet />
  );
};

export default VendorRoutes;
