import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiCalendar,
  FiMail,
  FiFileText,
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

  const navItems = [
    { name: "dashboard", icon: <FiHome />, label: "Dashboard" },
    { name: "analytics", icon: <FiPieChart />, label: "Analytics" },
    { name: "users", icon: <FiUsers />, label: "Users" },
    { name: "calendar", icon: <FiCalendar />, label: "Calendar" },
    { name: "messages", icon: <FiMail />, label: "Messages" },
    { name: "reports", icon: <FiFileText />, label: "Reports" },
    { name: "settings", icon: <FiSettings />, label: "Settings" },
  ];

  const stats = [
    { title: "Total Users", value: "2,453", change: "+12%", trend: "up" },
    { title: "Revenue", value: "$4,673", change: "+8%", trend: "up" },
    { title: "Pending", value: "342", change: "-3%", trend: "down" },
    { title: "Tasks", value: "89/120", change: "+5%", trend: "up" },
  ];

  const recentActivities = [
    { user: "John Doe", action: "created a new project", time: "2 mins ago" },
    { user: "Sarah Smith", action: "updated settings", time: "10 mins ago" },
    { user: "Mike Johnson", action: "completed task", time: "25 mins ago" },
    { user: "Emma Wilson", action: "added new files", time: "1 hour ago" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-purple-400">AdminPanel</h1>
          ) : (
            <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="px-4">
                <button
                  onClick={() => setActiveNav(item.name)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeNav === item.name
                      ? "bg-purple-900/50 text-purple-300"
                      : "hover:bg-gray-700/50 text-gray-300"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700/50 text-gray-300">
            <FiLogOut />
            {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white p-1 rounded-lg mr-4"
            >
              <FiMenu size={20} />
            </button>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700 relative">
              <FiBell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <FiUser size={16} />
              </div>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
          <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

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

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Performance Overview</h3>
                <select className="bg-gray-700 text-sm rounded-lg px-3 py-1 focus:outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center text-gray-400">
                Chart Area
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="font-bold mb-4">Recent Activities</h3>
              <ul className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 mt-1">
                      <FiUser size={14} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Orders</h3>
              <button className="text-sm text-purple-400 hover:text-purple-300">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr
                      key={item}
                      className="border-b border-gray-700/50 hover:bg-gray-700/20"
                    >
                      <td className="py-3">
                        #ORD-{item}00{item}
                      </td>
                      <td className="py-3">Customer {item}</td>
                      <td className="py-3">2023-05-{10 + item}</td>
                      <td className="py-3">${(item * 125).toFixed(2)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item % 3 === 0
                              ? "bg-green-900/50 text-green-400"
                              : item % 2 === 0
                              ? "bg-blue-900/50 text-blue-400"
                              : "bg-yellow-900/50 text-yellow-400"
                          }`}
                        >
                          {item % 3 === 0
                            ? "Completed"
                            : item % 2 === 0
                            ? "Processing"
                            : "Pending"}
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
