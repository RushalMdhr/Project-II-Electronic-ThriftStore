import React from "react";
import { useGetSoldOrdersQuery } from "../../redux/api/orderApiSlice";

const OrderManagement = () => {
  const { data: soldOrders, isError, isLoading } = useGetSoldOrdersQuery();
  console.log("Sold Orders", soldOrders);
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>
<div className="space-y-6">
  {soldOrders?.map((orders) => (
    <div
      key={orders._id}
      className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
    >
      {/* Customer Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 mb-4">
        <p className="text-xl font-semibold">{orders.customer}</p>
        <p className="text-blue-100">{orders.customerEmail}</p>
      </div>

      {/* Order Items */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
        <div className="space-y-3">
          {orders.orderItems?.map((items) => (
            <div key={items._id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
              <div className="flex items-center space-x-4">
                {items.product.images && (
                  <img
                    src={items.product.images[0]}
                    alt={items.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-800">{items.product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {items.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800">${items.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Payment Method</h4>
          <p className="text-sm text-gray-700 capitalize">Method: {orders.payment.method}</p>
          <p className="text-sm text-gray-700 capitalize">Status: {orders.payment.status}</p>
        </div>

        {/* Charges */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Order Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${orders.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">${orders.shipping}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">${orders.tax}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-green-800">
              <span>Total:</span>
              <span>${orders.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">Order ID: {orders._id}</span>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          Pending
        </span>
      </div>
    </div>
  ))}
</div>
    </>
  );
};

export default OrderManagement;
