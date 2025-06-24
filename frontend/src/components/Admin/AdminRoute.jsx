import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  console.log("✅ AdminRoute loaded");
  console.log("userInfo:", userInfo);

  return !userInfo ? (
    <Navigate to="/login" replace />
  ) : !userInfo.isAdmin ? (
    <Navigate to="/unauthorized" replace />
  ) : (
    <Outlet />
  );
};

export default AdminRoute;
