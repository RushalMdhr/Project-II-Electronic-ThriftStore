import React from "react";

const OrderList = ({ orders }) => {
  return (
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
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-700 hover:bg-gray-700/20"
                >
                  <td className="py-2">{order._id}</td>
                  <td className="py-2">{order.user?.email || "N/A"}</td>
                  <td className="py-2">Rs. {order.totalPrice}</td>
                  <td className="py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
