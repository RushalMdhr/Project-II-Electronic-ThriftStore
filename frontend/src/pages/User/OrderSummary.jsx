import React from "react";

const OrderSummary = ({ products, shipping, tax, total }) => (
  <div>
    <h3 className="text-2xl font-bold text-emerald-700 mb-6">Order Summary</h3>

    <div className="space-y-4 text-slate-700">
      {products.map((item) => (
        <div
          key={item.product._id}
          className="flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{item.product.name}</p>
            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
          </div>
          <p className="font-bold">
            Rs. {(item.product.price * item.quantity).toLocaleString()}
          </p>
        </div>
      ))}

      <div className="border-t border-slate-200 my-4" />

      <div className="flex justify-between text-lg">
        <span>Subtotal</span>
        <span className="font-semibold">
          Rs. {(total - shipping - tax).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-lg">
        <span>Shipping</span>
        <span className="font-semibold">Rs. {shipping}</span>
      </div>
      <div className="flex justify-between text-lg">
        <span>Tax</span>
        <span className="font-semibold">Rs. {tax}</span>
      </div>

      <div className="border-t border-slate-200 my-4" />

      <div className="flex justify-between text-xl font-bold text-emerald-700">
        <span>Total</span>
        <span>Rs. {total.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

export default OrderSummary;
