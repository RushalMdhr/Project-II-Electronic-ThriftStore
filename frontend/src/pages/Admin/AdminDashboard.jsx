import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiShoppingBag,
  FiShoppingCart,
  FiTag,
  FiPercent,
  FiStar,
  FiDollarSign,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiUser,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items for e-commerce
  const navItems = [
    { name: "dashboard", icon: <FiHome />, label: "Dashboard" },
    { name: "products", icon: <FiShoppingBag />, label: "Products" },
    { name: "orders", icon: <FiShoppingCart />, label: "Orders" },
    { name: "customers", icon: <FiUsers />, label: "Customers" },
    { name: "categories", icon: <FiTag />, label: "Categories" },
    { name: "discounts", icon: <FiPercent />, label: "Discounts" },
    { name: "analytics", icon: <FiPieChart />, label: "Analytics" },
    { name: "reviews", icon: <FiStar />, label: "Reviews" },
  ];

  // E-commerce specific stats
  const stats = [
    { title: "Total Revenue", value: "$24,531", change: "+18%", trend: "up" },
    { title: "Total Orders", value: "1,453", change: "+12%", trend: "up" },
    { title: "New Customers", value: "342", change: "+8%", trend: "up" },
    { title: "Conversion Rate", value: "3.2%", change: "+0.5%", trend: "up" },
  ];

  // Sample products data
  const topProducts = [
    { id: 1, name: "Wireless Headphones", price: 99.99, sold: 124 },
    { id: 2, name: "Smart Watch", price: 199.99, sold: 98 },
    { id: 3, name: "Bluetooth Speaker", price: 79.99, sold: 87 },
    { id: 4, name: "Phone Case", price: 24.99, sold: 76 },
    { id: 5, name: "USB-C Cable", price: 12.99, sold: 65 },
  ];

  // Sample orders data
  const recentOrders = [
    {
      id: "#1001",
      customer: "John Doe",
      items: 3,
      total: 149.97,
      payment: "Credit Card",
      status: "completed",
    },
    {
      id: "#1002",
      customer: "Jane Smith",
      items: 1,
      total: 199.99,
      payment: "PayPal",
      status: "shipped",
    },
    {
      id: "#1003",
      customer: "Mike Johnson",
      items: 5,
      total: 64.95,
      payment: "Credit Card",
      status: "processing",
    },
    {
      id: "#1004",
      customer: "Sarah Williams",
      items: 2,
      total: 179.98,
      payment: "Apple Pay",
      status: "completed",
    },
    {
      id: "#1005",
      customer: "David Brown",
      items: 1,
      total: 24.99,
      payment: "Credit Card",
      status: "pending",
    },
  ];

  return (
    <div className="flex p-0 h-screen bg-gray-900 text-gray-200">
      {/* Sidebar (same as before) */}
      {/* ... */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation (same as before) */}
        {/* ... */}

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
          <h2 className="text-2xl font-bold mb-6">E-commerce Dashboard</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors"
              >
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold mb-2">{stat.value}</p>
                <p
                  className={`text-sm ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="font-bold mb-4">Sales Overview</h3>
              <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center text-gray-400">
                Sales Chart
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="font-bold mb-4">Revenue by Category</h3>
              <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center text-gray-400">
                Category Chart
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Top Selling Products</h3>
              <button className="text-sm text-purple-400 hover:text-purple-300">
                View All Products
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                >
                  <div className="bg-gray-600 rounded-md w-full aspect-square mb-2"></div>
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">${product.price}</p>
                  <p className="text-xs text-green-400">{product.sold} sold</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Orders</h3>
              <button className="text-sm text-purple-400 hover:text-purple-300">
                View All Orders
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/20"
                    >
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.items}</td>
                      <td className="py-3">${order.total.toFixed(2)}</td>
                      <td className="py-3">{order.payment}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "completed"
                              ? "bg-green-900/50 text-green-400"
                              : order.status === "shipped"
                              ? "bg-blue-900/50 text-blue-400"
                              : order.status === "processing"
                              ? "bg-yellow-900/50 text-yellow-400"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
