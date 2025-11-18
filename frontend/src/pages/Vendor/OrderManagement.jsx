import {
  useGetSoldOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../redux/api/orderApiSlice";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const statusColors = {
  pending: "bg-yellow-500/30 text-yellow-400",
  confirmed: "bg-emerald-500/30 text-emerald-400",
  processing: "bg-blue-500/30 text-blue-400",
  shipped: "bg-indigo-500/30 text-indigo-400",
  delivered: "bg-green-500/30 text-green-400",
  cancelled: "bg-red-500/30 text-red-400",
  refunded: "bg-gray-500/30 text-gray-300",
};

const OrderManagement = () => {
  const [expanded, setExpanded] = useState(null);

  
  const { data: soldOrders, isLoading, isError } = useGetSoldOrdersQuery();
  soldOrders && console.log("soldOrders : ", soldOrders);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  if (isLoading)
    return (
      <div className="text-white text-center py-10">Loading orders...</div>
    );
  if (isError)
    return (
      <div className="text-red-400 text-center py-10">
        Failed to load orders.
      </div>
    );

  const updateStatus = async (status,orderId) => {
    console.log('changing status',orderId)
    const updatedStatus = await updateOrderStatus({ status: status, orderId : orderId }).unwrap();
    if (updatedStatus) {
      toast.success(`order updated to ${status}`);
      console.log(updatedStatus)
    }
    else{
      toast.error("error changing status")
    }
  };

  return (
    <div className="min-h-screen bg-[#1E2939] text-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Vendor Order Management
      </h1>

      <div className="overflow-x-auto bg-[#101828] rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-[#23605C] text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Total</th>
              <th colSpan="2" className="p-4 text-center">
                Payment
              </th>
              <th className="p-4 text-left">Order Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
            <tr className="bg-[#1b4644] text-sm">
              <th colSpan="4"></th>
              <th className="p-3 text-center font-normal">Method</th>
              <th className="p-3 text-center font-normal">Status</th>
              <th colSpan="2"></th>
            </tr>
          </thead>

          <tbody>
            {soldOrders?.map((order) => (
              <>
                <tr
                  key={order._id}
                  className="border-b border-[#2D3748] hover:bg-[#23605C]/20 transition-all"
                >
                  <td className="p-4 font-medium text-[#00c68e]">
                    {order._id.slice(-6)}
                  </td>
                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4 font-semibold">${order.total}</td>
                  <td className="p-4 text-center capitalize">
                    {order.payment?.method}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[order.payment?.status] ||
                        "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {order.payment?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      // className="bg-[#1E2939] text-gray-200 border border-gray-700 rounded-md p-2 text-sm"
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[order.status] ||
                        "bg-gray-700 text-gray-300"
                      }`}
                      value={order.status}
                      onChange={(e) => updateStatus(e.target.value, order._id)}
                    >
                      {[
                        "pending",
                        "confirmed",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                        "refunded",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="text-[#00c68e] hover:text-[#009966]"
                    >
                      {expanded === order._id ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </td>
                </tr>

                {expanded === order._id && (
                  <tr className="bg-[#1b1f2a]">
                    <td colSpan="8" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">
                          Order Details
                        </h3>

                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-700 rounded-md">
                            <thead>
                              <tr className="bg-[#23605C]/30 text-gray-200">
                                <th className="p-3 text-left">Product</th>
                                <th className="p-3 text-left">Quantity</th>
                                <th className="p-3 text-left">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.orderItems.map((item) => (
                                <tr
                                  key={item.product._id}
                                  className="border-t border-gray-700"
                                >
                                  <td className="p-3">
                                    <Link to={`/overview/${item.product._id}`}>
                                      {item.product.name}
                                    </Link>
                                  </td>
                                  <td className="p-3">{item.quantity}</td>
                                  <td className="p-3">${item.price}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="text-sm text-gray-300 mt-4 space-y-1">
                          <p>
                            Subtotal:{" "}
                            <span className="text-white font-medium">
                              ${order.subtotal}
                            </span>
                          </p>
                          <p>
                            Shipping:{" "}
                            <span className="text-white font-medium">
                              ${order.shipping}
                            </span>
                          </p>
                          <p>
                            Tax:{" "}
                            <span className="text-white font-medium">
                              ${order.tax}
                            </span>
                          </p>
                          <p>
                            Total:{" "}
                            <span className="text-emerald-400 font-semibold">
                              ${order.total}
                            </span>
                          </p>
                        </div>
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

export default OrderManagement;
