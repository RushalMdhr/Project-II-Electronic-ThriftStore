import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/vendor/dashboard" },
  { label: "Upload", path: "/vendor/upload" },
  { label: "Summary", path: "/vendor/summary" },
  { label: "Recent Orders", path: "/vendor/orders" },
  { label: "Product Management", path: "/vendor/products" },
  { label: "Sales Analytics", path: "/vendor/analytics" },
  { label: "Messages/Notifications", path: "/vendor/notifications" },
  { label: "Profile & Settings", path: "/vendor/profile" },
  { label: "Reviews & Ratings", path: "/vendor/reviews" },
];

const Sidebar = () => (
  <aside className="bg-[#10172a] text-white w-64 min-h-screen flex flex-col p-6">
    <h2 className="text-2xl font-bold mb-8 text-[#1de9b6]">Vendor</h2>
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-4 py-2 rounded transition-colors font-medium ${isActive ? "bg-emerald-600 text-white" : "hover:bg-[#1de9b6] hover:text-black"}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
