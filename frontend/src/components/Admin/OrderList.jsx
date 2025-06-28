import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { format } from "date-fns";

import { useGetOrdersQuery } from "../../redux/api/orderApiSlice.js"; // <-- import hook
const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from API using RTK Query hook
  const { data: orders, isLoading, isError, error } = useGetOrdersQuery();

  if (isLoading) {
    return <p className="text-white p-6">Loading orders...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-500 p-6">
        Error loading orders: {error?.data?.message || error.error}
      </p>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Orders</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="text-gray-400 border-b border-gray-600">
            <tr>
              <th className="pb-3">Order #</th>
              <th className="pb-3">User Email</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-700 hover:bg-gray-700/20 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-2">
                    {order._id ? order._id.slice(-6) : "N/A"}
                  </td>
                  <td className="py-2">{order.user?.email || "N/A"}</td>
                  <td className="py-2">Rs. {order.totalPrice}</td>
                  <td className="py-2">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-2">
                    <Badge variant={order.isPaid ? "success" : "destructive"}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Card for Order Details */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <Card className="rounded-lg">
              <CardContent className="space-y-4 p-4">
                <div className="text-sm text-gray-400">
                  Placed on:{" "}
                  {selectedOrder.createdAt
                    ? format(new Date(selectedOrder.createdAt), "PPpp")
                    : "N/A"}
                </div>

                <div className="space-y-1">
                  <div>
                    <strong>User:</strong> {selectedOrder.user?.email || "N/A"}
                  </div>
                  <div>
                    <strong>Total:</strong> Rs. {selectedOrder.totalPrice}
                  </div>
                  <div>
                    <strong>Payment:</strong>{" "}
                    {selectedOrder.paymentMethod || "N/A"}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Shipping Address:</h4>
                  <p className="text-sm text-gray-400">
                    {selectedOrder.shippingAddress?.address || "N/A"},{" "}
                    {selectedOrder.shippingAddress?.city || "N/A"},{" "}
                    {selectedOrder.shippingAddress?.country || "N/A"} -{" "}
                    {selectedOrder.shippingAddress?.postalCode || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Items:</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                    {selectedOrder.orderItems?.length > 0 ? (
                      selectedOrder.orderItems.map((item, idx) => (
                        <li key={idx}>
                          {item.product?.name || "Product"} × {item.quantity}{" "}
                          (Rs. {item.price})
                        </li>
                      ))
                    ) : (
                      <li>No items found</li>
                    )}
                  </ul>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant={selectedOrder.isPaid ? "success" : "destructive"}
                  >
                    {selectedOrder.isPaid ? "Paid" : "Unpaid"}
                  </Badge>
                  <Badge
                    variant={
                      selectedOrder.isDelivered ? "success" : "secondary"
                    }
                  >
                    {selectedOrder.isDelivered ? "Delivered" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderList;
