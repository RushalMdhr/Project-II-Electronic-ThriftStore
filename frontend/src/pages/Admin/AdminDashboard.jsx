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
import { useGetAdminSummaryQuery } from "../../redux/api/adminApiSlice.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data: summary, isLoading, error } = useGetAdminSummaryQuery();

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>

          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error fetching data</p>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Users" value={summary?.users ?? 0} />
                <StatCard title="Vendors" value={summary?.vendors ?? 0} />
                <StatCard title="Products" value={summary?.products ?? 0} />
                <StatCard
                  title="Total Revenue"
                  value={`Rs. ${summary?.revenue ?? 0}`}
                />
              </div>

              {/* Sales Overview Chart */}
              <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
                <h3 className="text-xl font-semibold mb-4">Sales Overview</h3>
                {summary?.salesData && summary.salesData.length > 0 ? (
                  <LineChart width={800} height={300} data={summary.salesData}>
                    <XAxis dataKey="_id" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <CartesianGrid stroke="#555" strokeDasharray="5 5" />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#4F46E5"
                      strokeWidth={2}
                    />
                  </LineChart>
                ) : (
                  <p className="text-gray-400">No sales data available</p>
                )}
              </div>

              {/* Recent Orders Table */}
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-gray-400 border-b border-gray-600">
                      <tr>
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">User Email</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary?.orders && summary.orders.length > 0 ? (
                        summary.orders.map((order) => (
                          <tr
                            key={order._id}
                            className="border-b border-gray-700 hover:bg-gray-700/20"
                          >
                            <td className="py-2">{order._id}</td>
                            <td className="py-2">
                              {order.user?.email || "N/A"}
                            </td>
                            <td className="py-2">Rs. {order.totalPrice}</td>
                            <td className="py-2">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center text-gray-400 py-4"
                          >
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-gray-800 p-5 rounded-lg shadow border border-gray-700 hover:border-indigo-500 transition duration-300">
    <h4 className="text-sm text-gray-400 mb-1">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;
