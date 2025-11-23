import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({
  isOpen,
  onClose,
  orderId,
  products,
  shipping,
  tax,
  total,
  paymentStatus,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleDone = () => {
    navigate("/myorders");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative animate-fadeIn scale-95 transition-all ring-1 ring-emerald-100">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-emerald-600 transition"
          onClick={onClose}
        >
          
        </button>

        {/* Header with icon */}
        <div className="text-center mb-6">
          <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={56} />
          <h3 className="text-3xl font-bold text-emerald-700 tracking-tight">
            Order Placed Successfully 🎉
          </h3>
          <p className="text-sm text-emerald-600/80 mt-2">
            Thank you for shopping with us
          </p>
        </div>

        {/* Order ID */}
        {orderId && (
          <div className="mb-5 text-center">
            <p className="text-xs text-emerald-700/70 uppercase tracking-wider">
              Order ID
            </p>
            <p className="text-md font-semibold tracking-wide bg-emerald-50/60 text-emerald-800 px-4 py-2 inline-block rounded-full mt-1">
              {orderId}
            </p>
          </div>
        )}

        {/* Order Details */}
        <div className="space-y-3 text-slate-700 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
          {products?.map((item) => {
            const itemTax = (
              item.product.price * item.quantity * 0.13 || 0
            ).toFixed(2);
            return (
              <div
                key={item?.product?._id}
                className="flex justify-between items-center bg-emerald-50/60 px-4 py-3 rounded-xl hover:bg-emerald-100/70 transition"
              >
                <div className="flex items-center gap-4">
                  {item?.product?.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg shadow-sm ring-1 ring-emerald-100"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-emerald-100 rounded-lg"></div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item?.product?.name}
                    </p>
                    <p className="text-xs text-emerald-700/80">
                      Qty: {item?.quantity} · Tax: Rs. {itemTax}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-emerald-700">
                  Rs. {(item?.product?.price * item?.quantity).toLocaleString()}
                </p>
              </div>
            );
          })}

          {/* Price Summary */}
          <div className="border-t border-emerald-100 my-4" />

          {[
            { label: "Subtotal", value: total - shipping - tax },
            { label: "Shipping", value: shipping },
            { label: "Tax (13%)", value: tax },
          ].map((line, index) => (
            <div key={index} className="flex justify-between text-base">
              <span className="text-slate-600">{line.label}</span>
              <span className="font-semibold text-slate-800">
                Rs. {line.value.toLocaleString()}
              </span>
            </div>
          ))}

          {/* Payment Status */}
          {paymentStatus && (
            <>
              <div className="border-t border-emerald-100 my-4" />
              <div className="flex justify-between text-base">
                <span className="text-slate-600">Payment Status</span>
                <span
                  className={`font-semibold capitalize ${
                    paymentStatus === "paid"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {paymentStatus}
                </span>
              </div>
            </>
          )}

          <div className="border-t border-emerald-100 my-4" />

          <div className="flex justify-between text-xl font-bold text-emerald-700">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleDone}
            className="px-8 py-3 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 shadow-lg hover:shadow-emerald-200 transition transform hover:-translate-y-0.5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
