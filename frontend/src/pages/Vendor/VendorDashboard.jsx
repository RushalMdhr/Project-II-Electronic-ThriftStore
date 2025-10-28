import React from "react";
import DashboardChart from "../../components/Admin/DashboardChart";
import {
  useGetDashboardQuery,
  useGetSalesGrowthQuery,
  useGetCategoryRangeQuery,
  useGetRecentOrdersQuery,
} from "../../redux/api/vendorApiSlice";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";

const VendorDashboard = () => {
  const { data: dashboard, isLoading: loadingDashboard } =
    useGetDashboardQuery();
  const { data: salesGrowth, isLoading: loadingSales } =
    useGetSalesGrowthQuery();
  const { data: categoryRange, isLoading: loadingCategory } =
    useGetCategoryRangeQuery();
  const { data: recentOrders, isLoading: loadingOrders } =
    useGetRecentOrdersQuery();

  if (
    loadingDashboard ||
    loadingSales ||
    loadingCategory ||
    loadingOrders ||
    !salesGrowth ||
    !categoryRange ||
    !dashboard ||
    !recentOrders
  ) {
    return <p className="p-6 text-lg text-gray-400">Loading dashboard...</p>;
  }
  // inside your component, after the loading check
  const categoryData = categoryRange.labels.map((label, idx) => ({
    category: label,
    count: categoryRange.data[idx],
  }));

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 p-4 shadow rounded-2xl flex items-center gap-4">
          <Package size={36} className="text-blue-400" />
          <div>
            <p className="text-sm text-gray-300">Products</p>
            <p className="text-xl font-bold">{dashboard.productsCount}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-4 shadow rounded-2xl flex items-center gap-4">
          <ShoppingCart size={36} className="text-green-400" />
          <div>
            <p className="text-sm text-gray-300">Orders</p>
            <p className="text-xl font-bold">{dashboard.totalOrders}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-4 shadow rounded-2xl flex items-center gap-4">
          <DollarSign size={36} className="text-yellow-400" />
          <div>
            <p className="text-sm text-gray-300">Revenue</p>
            <p className="text-xl font-bold">Rs. {dashboard.revenue}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-4 shadow rounded-2xl flex items-center gap-4">
          <Users size={36} className="text-purple-400" />
          <div>
            <p className="text-sm text-gray-300">Recent Orders</p>
            <p className="text-xl font-bold">{recentOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6 ">
        <DashboardChart
          title="Sales Growth"
          data={salesGrowth.data}
          dataKey="revenue"
          xAxisKey="label"
          lineColor="#4F46E5"
          type="line"
        />
        <DashboardChart
          title="Category Range"
          data={categoryData}
          dataKey="count"
          xAxisKey="category"
          type="donut"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-gray-800 p-6 shadow rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="w-full text-left border-collapse text-gray-200">
          <thead>
            <tr>
              <th className="border-b border-gray-700 p-2">Order ID</th>
              <th className="border-b border-gray-700 p-2">Status</th>
              <th className="border-b border-gray-700 p-2">Total</th>
              <th className="border-b border-gray-700 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-700">
                <td className="p-2">{order._id.slice(-6)}</td>
                <td className="p-2 capitalize">{order.status}</td>
                <td className="p-2">Rs. {order.totalPrice}</td>
                <td className="p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorDashboard;
