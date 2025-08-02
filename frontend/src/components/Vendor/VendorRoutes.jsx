import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Sidebar from "../../pages/Vendor/Sidebar";
const VendorRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  console.log("userInfo:", userInfo);

  return !userInfo ? (
    <Navigate to="/login" replace />
  ) : !userInfo.isVendor ? (
    <Navigate to="/unauthorized" replace />
  ) : (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorRoutes;
