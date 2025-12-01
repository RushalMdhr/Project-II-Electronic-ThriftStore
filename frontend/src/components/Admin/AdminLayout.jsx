import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? "5rem" : "16rem";

  return (
    <div className="flex min-h-screen bg-[#0a1120] text-white">
      {/* Sidebar */}
      <aside
        className="bg-[#131a2b] p-4 flex flex-col transition-all duration-300 ease-in-out"
        style={{ width: sidebarWidth }}
      >
        {/* Header and toggle */}
        <div className="flex items-center justify-between mb-10">
          {!collapsed && (
            <h2 className="text-3xl font-extrabold text-[#1de9b6] select-none">
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[#1de9b6] hover:text-white focus:outline-none"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i
              className={`ri-arrow-left-s-line text-3xl transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            ></i>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col space-y-6 text-lg font-medium">
          <Link
            to="/admin"
            className={`flex items-center px-3 py-3 transition
      hover:bg-[#1de9b6] hover:text-[#0a1120] rounded-sm
      ${collapsed ? "justify-center w-12 h-12" : "space-x-3 rounded-lg"}
    `}
            title="Dashboard"
          >
            <i className="ri-dashboard-line text-2xl"></i>
            {!collapsed && <span>Dashboard</span>}
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center px-3 py-3 transition
      hover:bg-[#1de9b6] hover:text-[#0a1120] rounded-sm
      ${collapsed ? "justify-center w-12 h-12" : "space-x-3 rounded-lg"}
    `}
            title="Manage Users"
          >
            <i className="ri-user-settings-line text-2xl"></i>
            {!collapsed && <span>Manage Users</span>}
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center px-3 py-3 transition
      hover:bg-[#1de9b6] hover:text-[#0a1120] rounded-sm
      ${collapsed ? "justify-center w-12 h-12" : "space-x-3 rounded-lg"}
    `}
            title="Manage Orders"
          >
            <i className="ri-file-list-line text-2xl"></i>
            {!collapsed && <span>Manage Orders</span>}
          </Link>

          <Link
            to="/admin/blacklisted-products"
            className={`flex items-center px-3 py-3 transition
      hover:bg-[#1de9b6] hover:text-[#0a1120] rounded-sm
      ${collapsed ? "justify-center w-12 h-12" : "space-x-3 rounded-lg"}
    `}
            title="Manage Products"
          >
            <i className="ri-box-3-line text-2xl"></i>
            {!collapsed && <span>Manage Products</span>}
          </Link>

          <Link
            to="/admin/categories"
            className={`flex items-center px-3 py-3 transition
    hover:bg-[#1de9b6] hover:text-[#0a1120] rounded-sm
    ${collapsed ? "justify-center w-12 h-12" : "space-x-3 rounded-lg"}
  `}
            title="Manage Categories"
          >
            <i className="ri-folders-line text-2xl"></i>
            {!collapsed && <span>Manage Categories</span>}
          </Link>
          <Link
            to="/admin/reviews"
            className={`flex items-center px-3 py-3 transition
    hover:bg-[#1de9b6] hover:text-[#0a1120] rounded-sm
    ${collapsed ? "justify-center w-12 h-12" : "space-x-3 rounded-lg"}
  `}
            title="Reviews"
          >
            <i className="ri-chat-1-line text-2xl"></i>
            {!collapsed && <span>Reviews</span>}
          </Link>

          <Link
            to="/admin/vendor-payments"
            className={`flex items-center px-3 py-3 transition
    hover:bg-[#1de9b6] hover:text-[#0a1120] rounded-sm
    ${collapsed ? "justify-center w-12 h-12" : "space-x-3 rounded-lg"}
  `}
            title="Manage Categories"
          >
            <i className="ri-time-line text-2xl"></i>

            {!collapsed && <span>Pending Payments</span>}
          </Link>
          <Link
            to="/admin/transaction-histry"
            className={`flex items-center px-3 py-3 transition
    hover:bg-[#1de9b6] hover:text-[#0a1120] rounded-sm
    ${collapsed ? "justify-center w-12 h-12" : "space-x-3 rounded-lg"}
  `}
            title="Transaction Histry"
          >
            <i className="ri-file-list-3-line text-2xl"></i>

            {!collapsed && <span>Transaction Histry</span>}
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 bg-[#0a1120]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
