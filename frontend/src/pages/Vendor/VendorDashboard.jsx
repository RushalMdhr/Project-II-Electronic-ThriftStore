import React from "react";
import DashboardChart from "../../components/Admin/DashboardChart";
import {
  useGetDashboardQuery,
  useGetSalesGrowthQuery,
  useGetCategoryRangeQuery,
  useGetRecentOrdersQuery,
} from "../../redux/api/vendorApiSlice";
import { Package, ShoppingCart, DollarSign, Users, TrendingUp } from "lucide-react";
import LoadingScreen from "../../components/ui/Loading";

const VendorDashboard = () => {
  const { data: dashboard, isLoading: loadingDashboard } = useGetDashboardQuery();
  const { data: salesGrowth, isLoading: loadingSales } = useGetSalesGrowthQuery();
  const { data: categoryRange, isLoading: loadingCategory } = useGetCategoryRangeQuery();
  const { data: recentOrders, isLoading: loadingOrders } = useGetRecentOrdersQuery();

  // Calculate pending revenue
  const pendingRevenue = dashboard?.revenue?.income?.pending || 0;
  const receivedRevenue = dashboard?.revenue?.income?.received || 0;
  const totalRevenue = dashboard?.revenue?.income?.total || 0;
  const lastPaymentDate = dashboard?.revenue?.income?.lastPaid 
    ? new Date(dashboard.revenue.income.lastPaid).toLocaleDateString() 
    : "Not paid yet";

  if (loadingDashboard || loadingSales || loadingCategory || loadingOrders) {
    return <LoadingScreen color="emerald" text="Loading dashboard..." />
  }

  const categoryData = categoryRange?.labels?.map((label, idx) => ({
    category: label,
    count: categoryRange.data[idx] || 0,
  })) || [];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      {/* Cards - Fixed Alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-6">
        {/* Product Card */}
        <div className="bg-gray-800 p-6 shadow rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-900/50 rounded-xl">
              <Package size={28} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Products</p>
              <p className="text-2xl font-bold">{dashboard?.productsCount || 0}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Active listings</p>
        </div>

        {/* Orders Card */}
        <div className="bg-gray-800 p-6 shadow rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-900/50 rounded-xl">
              <ShoppingCart size={28} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Orders</p>
              <p className="text-2xl font-bold">{dashboard?.totalOrders || 0}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Total orders</p>
        </div>

        {/* Pending Revenue Card */}
        <div className="bg-gray-800 p-6 shadow rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-900/50 rounded-xl">
              <span className="text-yellow-400 text-2xl font-bold">Rs</span>
            </div>
            <div>
              <p className="text-sm text-gray-300">Pending Revenue</p>
              <p className="text-2xl font-bold">Rs. {pendingRevenue.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Awaiting payment</p>
        </div>

        {/* Received Revenue Card */}
        <div className="bg-gray-800 p-6 shadow rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-900/50 rounded-xl">
              <TrendingUp size={28} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Received Revenue</p>
              <p className="text-2xl font-bold">Rs. {receivedRevenue.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Paid to you</p>
        </div>

        {/* Recent Orders Card */}
        <div className="bg-gray-800 p-6 shadow rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-900/50 rounded-xl">
              <Users size={28} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Recent Orders</p>
              <p className="text-2xl font-bold">{recentOrders?.length || 0}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Last 30 days</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total Revenue</span>
            <span className="text-xl font-bold text-emerald-400">
              Rs. {totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Last Payment</span>
            <span className="text-lg font-medium text-yellow-400">
              {lastPaymentDate}
            </span>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Payment Status</span>
            <span className={`text-lg font-medium ${pendingRevenue > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {pendingRevenue > 0 ? 'Pending' : 'All Clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {salesGrowth?.data && (
          <DashboardChart
            title="Sales Growth"
            data={salesGrowth.data}
            dataKey="revenue"
            xAxisKey="label"
            lineColor="#4F46E5"
            type="line"
          />
        )}
        
        {categoryData.length > 0 && (
          <DashboardChart
            title="Category Distribution"
            data={categoryData}
            dataKey="count"
            xAxisKey="category"
            type="donut"
          />
        )}
      </div>

      {/* Recent Orders Table */}
      {recentOrders?.length > 0 && (
        <div className="bg-gray-800 p-6 shadow rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <span className="text-sm text-gray-400">
              Showing {Math.min(recentOrders.length, 10)} orders
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-gray-200">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 font-medium">Order ID</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Items</th>
                  <th className="p-3 font-medium">Total</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 10).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-700/50 border-b border-gray-700/30">
                    <td className="p-3 font-mono text-sm">{order._id.slice(-8)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-emerald-900/50 text-emerald-300' :
                        order.status === 'shipped' ? 'bg-blue-900/50 text-blue-300' :
                        order.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">{order.orderItems?.length || 0} items</td>
                    <td className="p-3 font-medium">Rs. {order.total?.toLocaleString()}</td>
                    <td className="p-3 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;