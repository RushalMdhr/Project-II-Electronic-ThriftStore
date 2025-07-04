import React from "react";
import { useLocation } from "react-router";

const Checkout = () => {
  const { state } = useLocation();
    const products = state?.cartItemsData || [];
    
  // Calculate total price
  const total = products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1120] to-[#1de9b6]/10 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-[#1de9b6] mb-2">Checkout</h2>
        <p className="text-gray-600 mb-6">
          Review your order before placing it.
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Products List */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Your Items
            </h3>
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-gray-500">No items in your cart.</div>
              ) : (
                products.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center bg-white rounded-lg shadow border border-gray-100 p-4"
                  >
                    <img
                      src={
                        item.product.images[0] || "https://via.placeholder.com/60"
                      }
                      alt={item.product.name}
                      className="w-16 h-16 rounded object-cover mr-4 border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.product.name}
                      </h4>
                      <div className="text-gray-500 text-sm">
                        {item.product.category}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-700 font-medium">
                        ₹{item.product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Order Summary */}
          <div className="w-full md:w-80 bg-[#0a1120] text-white rounded-lg shadow p-6 h-fit">
            <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>{products.length}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="border-t border-[#1de9b6]/30 my-4"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button
              className="mt-6 w-full bg-[#1de9b6] hover:bg-[#13c9a7] text-[#0a1120] font-bold py-2 rounded transition"
              disabled={products.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
