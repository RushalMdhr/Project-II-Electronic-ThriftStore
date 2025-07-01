import React from "react";
import OrderList from "../../components/Admin/OrderList";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice"; // assuming you have this API slice

const ManageOrders = () => {
  // Fetch orders (adjust according to your data fetching setup)
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  if (isLoading) return <p className="text-white">Loading orders...</p>;
  if (isError) return <p className="text-red-500">Error loading orders.</p>;

  return (
    <div className="bg-[#131a2b] min-h-screen px-10 py-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-3xl text-[#1de9b6] font-bold">Manage Orders</h2>
          <p className="text-sm text-gray-400 mt-1">
            View, edit, and manage all customer orders.
          </p>
        </div>
        <div>
          <span className="text-m bg-[#1de9b6]/10 text-[#1de9b6] px-3 py-1 rounded-full font-medium">
            Total: {orders.length}
          </span>
        </div>
      </div>

      <div>
        <OrderList orders={orders} />
      </div>
    </div>
  );
};

export default ManageOrders;
