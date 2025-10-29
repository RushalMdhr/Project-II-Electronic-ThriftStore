import { useState } from "react";
import { useGetMyOrdersQuery } from "../redux/api/orderApiSlice";

const MyOrders = () => {
  const { data: allOrders = [], isLoading, isError } = useGetMyOrdersQuery();
  const [expandedRow, setExpandedRow] = useState(null);

  if (isLoading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (isError) return <p className="text-center text-red-500 mt-10">Failed to load orders.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
        My Orders
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allOrders.map((order, index) => (
              <>
                <tr
                  key={order._id}
                  className="hover:bg-emerald-50 transition-colors cursor-pointer"
                  onClick={() =>
                    setExpandedRow(expandedRow === order._id ? null : order._id)
                  }
                >
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800 capitalize">
                      {order.payment.method}
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        order.payment.status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    Rs. {order.total}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-emerald-600 font-semibold hover:underline">
                      {expandedRow === order._id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {/* Expandable Row */}
                {expandedRow === order._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="p-4">
                      <div className="space-y-3">
                        {order.orderItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {item.product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-emerald-700">
                              Rs. {item.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
