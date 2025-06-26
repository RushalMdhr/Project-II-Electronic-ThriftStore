import { useState } from "react";
import { useGetAdminSummaryQuery } from "../../redux/api/adminApiSlice.js";
import StatCard from "../../components/Admin/StatCard";
import DashboardChart from "../../components/Admin/DashboardChart";
import OrderList from "../../components/Admin/OrderList";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Users" value={summary?.users ?? 0} />
                <StatCard title="Vendors" value={summary?.vendors ?? 0} />
                <StatCard title="Products" value={summary?.products ?? 0} />
                <StatCard
                  title="Total Revenue"
                  value={`Rs. ${summary?.revenue ?? 0}`}
                />
              </div>

              {/* Charts */}
              <DashboardChart
                title="Sales Overview"
                data={summary?.salesData}
                dataKey="total"
              />

              {summary?.userGrowthData && (
                <DashboardChart
                  title="New Users Over Time"
                  data={summary.userGrowthData}
                  dataKey="count"
                  xAxisKey="date"
                  lineColor="#10B981"
                />
              )}

              {/* Orders */}
              {summary?.orders && <OrderList orders={summary.orders} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
