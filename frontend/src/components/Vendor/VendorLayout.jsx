import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const VendorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area where nested routes render */}
      <main className="flex-1 p-6 bg-gray-800 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;
