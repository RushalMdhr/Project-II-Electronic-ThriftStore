import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { toast } from "react-toastify";
import { useEsewaPaymentMutation } from "../../redux/api/transactionApiSlice";
import { useDispatch } from "react-redux";
import OrderSummary from "./OrderSummary";
import { useUserId } from "../../components/UserProvider";
import { groupProductsByVendor } from "../../Utils/shipping.js";
import VendorProducts from "./VendorProducts.jsx";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const products = state?.selectedCartItems || [];

  const [dropdown, setDropdown] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const dropdownRef = useRef();

  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [esewaPayment] = useEsewaPaymentMutation();
  const userId = useUserId();
  const [userData, setUserData] = useState(null);

  const vendorGroups = groupProductsByVendor(products);
  const totalShipping = Object.values(vendorGroups).reduce(
    (sum, g) => sum + g.shipping,
    0
  );

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };

    fetchUser();
  }, [userId]);

  const [address, setAddress] = useState({
    street: "",
    district: "",
    city: "",
    province: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  /* ------- prices -------- */
  const subTotal = products.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const shipping = 100;
  const tax = subTotal * 0.13;
  const total = subTotal + totalShipping + tax;

  // 🔧 FIXED — schema-compliant cities and provinces
  const provincesEnum = [
    "Koshi",
    "Madhesh",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim",
  ];

  const provinceDistricts = {
    Koshi: ["Morang", "Sunsari", "Jhapa"],
    Madhesh: ["Dhanusha", "Mahottari"],
    Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur"],
    Gandaki: ["Kaski", "Lamjung"],
    Lumbini: ["Rupandehi", "Kapilvastu"],
    Karnali: ["Surkhet"],
    Sudurpashchim: ["Kanchanpur", "Kailali"],
  };

  const districtCities = {
    Kathmandu: ["Kathmandu", "Tokha", "Budhanilkantha", "Gokarneshwar"],
    Lalitpur: ["Lalitpur", "Godawari", "Sankharapur"],
    Bhaktapur: ["Bhaktapur", "Madhyapur Thimi", "Banepa"],
    Kirtipur: ["Kirtipur"],
    Chandragiri: ["Chandragiri"],
    Suryabinayak: ["Suryabinayak"],
    Dhulikhel: ["Dhulikhel", "Panauti"],
  };

  useEffect(() => {
    if (userData?.shippingAddress) {
      const { name, ...rest } = userData.shippingAddress; // remove name
      setAddress(rest);
    }
  }, [userData]);

  /* ---------- store order details after placing order ---------- */
  const [orderData, setOrderData] = useState(null);

  const data = {
    orderItems: products.map((e) => ({
      productId: e.product._id,
      quantity: e.quantity,
    })),
    method: selectedPayment,
    address, // include the address state
    shipping: totalShipping, // keep as number
    tax, // number
    total, // number
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

      setOrderData(res); // store full order details
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
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {Object.values(vendorGroups).map((group) => (
                <VendorProducts key={group.vendorInfo._id} group={group} />
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
                <span className="font-semibold">
                  Rs. {totalShipping.toLocaleString()}
                </span>
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

          {/* ===== Saved Shipping Address ===== */}
          <section className="mt-8">
            <h3 className="text-xl font-bold text-emerald-700 mb-2">
              Shipping Address
            </h3>

            {!isEditing ? (
              <div className="space-y-1 text-slate-600">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.district}
                </p>
                <p>{address.province}</p>
                <p className="font-semibold">📞 {address.phone}</p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 text-emerald-600 font-medium underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Street */}
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg"
                  placeholder="Street / Ward"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />

                {/* Province */}
                <select
                  className="w-full border p-2 rounded-lg"
                  value={address.province}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      province: e.target.value,
                      district: "",
                      city: "",
                    })
                  }
                >
                  <option value="">Select Province</option>
                  {provincesEnum.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                {/* District */}
                <select
                  className="w-full border p-2 rounded-lg"
                  value={address.district}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      district: e.target.value,
                      city: "",
                    })
                  }
                  disabled={!address.province}
                >
                  <option value="">Select District</option>
                  {address.province &&
                    provinceDistricts[address.province]?.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>

                {/* City sorted by district */}
                <select
                  className="w-full border p-2 rounded-lg"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  disabled={!address.district}
                >
                  <option value="">Select City</option>
                  {address.district &&
                    districtCities[address.district]?.sort().map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>

                {/* Phone */}
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg"
                  placeholder="Phone"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                />

                {/* Save Button */}
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
            )}
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

          {orderData && orderData.payment?.method !== "esewa" && (
            <OrderSummary
              isOpen={true}
              onClose={() => navigate("/myorders")}
              orderId={orderData._id}
              products={orderData.orderItems.map((item) => {
                const foundProduct = products?.find(
                  (p) => p?.product?._id == item?.product
                );

                return {
                  product: foundProduct?.product || {
                    name: foundProduct?.product?.name || "Unknown Product",
                    price: item?.price,
                    images: foundProduct?.product?.images || [],
                  },
                  quantity: item.quantity,
                };
              })}
              shipping={orderData.shipping}
              tax={orderData.tax}
              total={orderData.total}
              paymentStatus={orderData.payment?.status || "pending"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
