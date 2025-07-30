import { useState } from "react";
import { useGetMyOrdersQuery } from "../../../redux/api/orderApiSlice"
import { useEffect } from "react";

const MyOrders = () => {
  const { data: allOrders = [], isLoading, isError, refetch } = useGetMyOrdersQuery();
  console.log(allOrders)
  const [filter, setFilter] = useState("all");
  const myOrders=[]
  myOrders.push(...allOrders);  

  // Filter orders based on selected filter
  const filteredOrders = (() => {
    if (filter === "inProgress") {
      return allOrders.filter(order => !order.completed);
    }
    if (filter === "completed") {
      return allOrders.filter(order => order.completed);
    }
    return allOrders;
  })();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex gap-4 mb-6 justify-center">
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === "all" ? "bg-yellow-400" : "bg-yellow-200"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === "inProgress" ? "bg-yellow-400" : "bg-yellow-200"
          }`}
          onClick={() => setFilter("inProgress")}
        >
          In Progress
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === "completed" ? "bg-yellow-400" : "bg-yellow-200"
          }`}
          onClick={() => setFilter("completed")}
        >
          Delivered
        </button>
      </div>

      {isLoading && (
        <div className="text-center text-gray-500 py-8">Loading orders...</div>
      )}
      {isError && (
        <div className="text-center text-red-500 py-8">Failed to load orders.</div>
      )}

      {!isLoading && !isError && filteredOrders.length === 0 && (
        <div className="text-center text-gray-500 py-8">No orders found.</div>
      )}

      <div className="space-y-8">
        {filteredOrders.map(order => (
          <div
            key={order._id}
            className="border rounded-xl shadow-sm p-6 bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {new Date(order?.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.completed ? "Delivered" : "In Progress"}
              </span>
            </div>
            <div className="mb-4">
              {order?.orderItems?.map(orderItem => (
                <div
                  key={orderItem._id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div>
                    <span className="font-medium">{orderItem.product.name}</span>
                    <span className="ml-2 text-gray-500">x{orderItem.quantity}</span>
                  </div>
                  <div className="text-right text-gray-700 font-semibold">
                    ₹{orderItem.product.price}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-lg text-yellow-700">
                Total: ₹{order?.total_price}
              </span>
              {order.completed && (
                <button className="bg-yellow-300 hover:bg-yellow-400 border-2 rounded-xl px-4 py-1 font-semibold transition">
                  Give Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders
