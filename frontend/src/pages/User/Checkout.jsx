import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { toast } from "react-toastify";
import { useEsewaPaymentMutation } from "../../redux/api/transactionApiSlice";
import { useDispatch } from "react-redux";
import OrderSummary from "./OrderSummary";

const Checkout = () => {
  const { state } = useLocation();
  const products = state?.selectedCartItems || [];

  const [dropdown, setDropdown] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const dropdownRef = useRef();

  /* ------- prices -------- */
  const subTotal = products.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const shipping = 100;
  const tax = subTotal * 0.13;
  const total = subTotal + shipping + tax;

  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [esewaPayment] = useEsewaPaymentMutation();

  /* show details only after successful order */
  const [orderId, setOrderId] = useState(null);

  const data = {
    orderItems: products?.map((e) => ({
      productId: e.product._id,
      quantity: e.quantity,
    })),
    method: selectedPayment,
  };

  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const paymentMethods = [
    { value: "cod", label: "Cash on Delivery" },
    { value: "esewa", label: "eSewa" },
  ];

  const HandleOrder = async () => {
    try {
      const res = await createOrder(data).unwrap();
      if (res.error) {
        toast.error(res.error.message);
        return;
      }
      setOrderId(res._id); // <-- triggers detail card
      toast.success("Order placed!");
      if (selectedPayment === "esewa") {
        const payment = await esewaPayment({
          amount: total,
          productId: res._id,
        }).unwrap();
        if (payment?.url) window.location.href = payment.url;
      }
    } catch (err) {
      toast.error(err?.message || "Order failed");
    }
  };

  /* ---------- UI ------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- Left – Items (scrollable) ---------- */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8 flex flex-col">
          <h2 className="text-3xl font-bold text-emerald-700 mb-2">Checkout</h2>
          <p className="text-slate-500 mb-8">Review your items</p>

          {products.length === 0 ? (
            <div className="text-center text-slate-400 py-16">
              Your cart is empty
            </div>
          ) : (
            // ONLY this area scrolls
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {products.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-6 bg-slate-50 hover:bg-emerald-50 rounded-2xl p-6 transition"
                >
                  <img
                    src={
                      item.product.images[0] || "https://via.placeholder.com/80"
                    }
                    alt={item.product.name}
                    className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800">
                      {item.product.name}
                    </h3>
                    <p className="text-slate-500">
                      {item.product.category?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">
                      Rs. {item.product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Right – Details / Summary (always visible + sticky) ---------- */}
        <div className="lg:col-span-1 self-start sticky top-8 bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {/* =====  Pre-order details  ===== */}
          <section>
            <h3 className="text-2xl font-bold text-emerald-700 mb-6">
              Order Details
            </h3>
            <div className="space-y-3 text-slate-600">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold">
                  Rs. {subTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Shipping</span>
                <span className="font-semibold">Rs. {shipping}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax (13%)</span>
                <span className="font-semibold">Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 my-4" />
              <div className="flex justify-between text-xl font-bold text-emerald-700">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </section>

          {/* =====  Payment selector  ===== */}
          <div ref={dropdownRef}>
            <label className="block text-slate-600 mb-2">Payment method</label>
            <button
              onClick={() => setDropdown((d) => !d)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <span>
                {paymentMethods.find((m) => m.value === selectedPayment)?.label}
              </span>
              <span className="text-emerald-600">▼</span>
            </button>
            {dropdown && (
              <div className="mt-2 rounded-xl bg-white border border-emerald-200 shadow-lg overflow-hidden">
                {paymentMethods.map((m) => (
                  <div
                    key={m.value}
                    onClick={() => {
                      setSelectedPayment(m.value);
                      setDropdown(false);
                    }}
                    className="px-4 py-3 text-emerald-800 hover:bg-emerald-50 cursor-pointer transition"
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =====  Place Order button  ===== */}
          <button
            onClick={HandleOrder}
            disabled={products.length === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition transform hover:scale-[1.02]"
          >
            Place Order
          </button>

          {/* =====  Post-order summary (appears below details)  ===== */}
          {orderId && (
            <div className="pt-6 border-t border-slate-200">
              <OrderSummary
                products={products}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
