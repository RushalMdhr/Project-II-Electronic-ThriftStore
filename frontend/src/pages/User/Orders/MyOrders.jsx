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
        <div className="text-center text-red-500 py-8">
          Failed to load orders.
        </div>
      )}

      {!isLoading && !isError && filteredOrders.length === 0 && (
        <div className="text-center text-gray-500 py-8">No orders found.</div>
      )}

      <div className="space-y-8">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition-shadow duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                {new Date(order?.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.completed ? "Delivered" : "In Progress"}
              </span>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-gray-100">
              {order?.orderItems?.map((orderItem) => (
                <div
                  key={orderItem._id}
                  className="flex justify-between items-center py-4"
                >
                  {/* Left side: product image + name */}
                  <div className="flex items-center gap-4">
                    <img
                      src={orderItem.product.images?.[0] || "/placeholder.png"}
                      alt={orderItem.product.name}
                      className="w-14 h-14 object-cover rounded-md border"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {orderItem.product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Qty: {orderItem.quantity}
                      </div>
                    </div>
                  </div>

                  {/* Right side: price */}
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      Rs. {orderItem.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tax (13%): Rs.{" "}
                      {(orderItem.price * orderItem.quantity * 0.13).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <span className="font-bold text-lg text-yellow-700">
                Total: Rs.{order?.total?.toFixed(2)}
              </span>

              {order.completed && (
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-none rounded-lg px-4 py-2 font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
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
