import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { useGetMyOrdersQuery } from "../../../redux/api/orderApiSlice";
import { shortIds, formatDate } from "../../../components/IdShorter";
import OrderFilterBar from "./OrderFilterBar"; // <-- imported bar
import CreateReview from "../../../components/CreateReview";

/* =================================================================== */
/*  Market-ready “My Orders” page                                      */
/*  - Mobile-first responsive                                          */
/*  - Search + calendar-day filter + sort (newest | total | status)   */
/*  - Collapsible line-items                                           */
/*  - Vendor chip, serial number, aligned payment/total                */
/*  - Loading & empty states                                           */
/* =================================================================== */
const MyOrders = () => {
  const { data: raw = [], isLoading, isError, refetch } = useGetMyOrdersQuery();
  const [expanded, setExpanded] = useState(new Set());

  /* ------ filter / sort state ------ */
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sort, setSort] = useState("createdAt");

  /* ------ derived list (client-side) ------ */
  const orders = useMemo(() => {
    let filtered = raw.filter((o) => {
      const matchesText =
        search === "" ||
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        o.orderItems?.some((i) =>
          i.product.name.toLowerCase().includes(search.toLowerCase())
        );
      const matchesDate =
        dateFilter === "" ||
        new Date(o.createdAt).toISOString().slice(0, 10) === dateFilter;
      return matchesText && matchesDate;
    });

    const sorter = {
      createdAt: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      total: (a, b) => b.total - a.total,
      status: (a, b) => a.status.localeCompare(b.status),
    };
    return [...filtered].sort(sorter[sort] || sorter.createdAt);
  }, [raw, search, dateFilter, sort]);

  /* ------ helpers ------ */
  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const statusBadge = (st) => {
    const map = {
      pending: {
        text: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      confirmed: {
        text: "Confirmed",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
      },
      shipped: {
        text: "Shipped",
        color: "bg-purple-100 text-purple-800",
        icon: Package,
      },
      delivered: {
        text: "Delivered",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      cancelled: {
        text: "Cancelled",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      },
      returned: {
        text: "Returned",
        color: "bg-gray-100 text-gray-800",
        icon: XCircle,
      },
    };
    const c = map[st?.toLowerCase()] || map.pending;
    const I = c.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}
      >
        <I className="w-3 h-3" /> {c.text}
      </span>
    );
  };

  const payBadge = (s) =>
    s === "paid" ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3" /> Paid
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );

  /* ----------  empty / error / loading  ---------- */
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading orders…</span>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
          <XCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="mt-3 text-red-600">Couldn’t load orders</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );

  /* ----------  1.  absolute empty (user has never ordered)  ---------- */
  if (!isLoading && !isError && raw.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
          <Package className="w-14 h-14 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No orders yet
          </h3>
          <p className="text-gray-500 mt-1">
            When you place an order it will show up here.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ----------  2.  filtered empty (user HAS orders but filter hides them)  ---------- */
  if (!isLoading && !isError && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* keep the filter bar on screen so user can tweak search */}
          <OrderFilterBar
            search={search}
            setSearch={setSearch}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            sort={sort}
            setSort={setSort}
          />
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm mt-4">
            <Package className="w-14 h-14 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No results
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search or date filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setDateFilter("");
                setSort("createdAt");
              }}
              className="inline-block mt-4 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>
    );
  }
  /* ----------  main UI  ---------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">
            Track, manage and reorder in one place.
          </p>
        </div>

        {/* reusable filter bar (search + calendar + sort) */}
        <OrderFilterBar
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sort={sort}
          setSort={setSort}
        />

        {/* order cards */}
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const vendor = order.orderItems?.[0]?.vendor;
            const isOpen = expanded.has(order._id);

            return (
              <section
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* header */}
                <div
                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggle(order._id)}
                >
                  {/* left cluster */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-400 w-7">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
                      {shortIds(order._id)}
                    </span>
                    {statusBadge(order.status)}
                    {vendor && (
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                        {vendor.name || vendor.businessName || "Vendor"}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  {/* right cluster - aligned payment + total */}
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-2 text-sm w-56 justify-end">
                      <span className="text-gray-500">Payment</span>
                      <span className="font-medium">
                        {order.payment.method}
                      </span>
                      {payBadge(order.payment?.status)}
                    </div>
                    <div className="text-gray-900 font-semibold text-right w-32">
                      Rs. {order.total?.toFixed(2)}
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* collapsible detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-5 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* items */}
                      <div className="lg:col-span-2">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">
                          Items
                        </h3>
                        <div className="space-y-3">
                          {order.orderItems?.map((it) => (
                            <div
                              key={it._id}
                              className={`p-4 rounded-xl border bg-white ${
                                it.status === "cancelled"
                                  ? "border-red-200"
                                  : "border-gray-200"
                              }`}
                            >
                              <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* LEFT COLUMN — Product Info */}
                                  <div className="flex flex-col">
                                    <Link
                                      to={`/overview/${it.product._id}`}
                                      className={`font-medium text-gray-900 hover:text-emerald-600 ${
                                        it.status === "cancelled"
                                          ? "line-through text-gray-400"
                                          : ""
                                      }`}
                                    >
                                      {it.product.name}
                                    </Link>

                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                      {/* Quantity */}
                                      <span className="flex items-center gap-1">
                                        <i className="fa-solid fa-box"></i>
                                        Qty {it.quantity}
                                      </span>

                                      {/* Price Each */}
                                      <span className="flex items-center gap-1">
                                        <i className="fa-solid fa-tag"></i>
                                        Rs. {it.price?.toFixed(2)}
                                      </span>

                                      {/* Total Price */}
                                      <span className="font-medium text-gray-900 flex items-center gap-1">
                                        <i className="fa-solid fa-coins"></i>
                                        Rs.{" "}
                                        {(it.quantity * it.price)?.toFixed(2)}
                                      </span>
                                    </div>

                                    {it.status === "cancelled" && (
                                      <p className="mt-2 text-xs text-red-600">
                                        <i className="fa-solid fa-circle-xmark"></i>
                                        &nbsp;Cancelled · {it.reasonForCancel}
                                      </p>
                                    )}
                                  </div>

                                  {/* RIGHT COLUMN — Review Button / Form */}
                                  {order.status === "delivered" && (
                                    <div className="md:ml-auto w-full md:w-auto md:justify-self-end">
                                      <CreateReview
                                        productId={it.product._id}
                                        orderId={order._id}
                                        sellerId={it.product.uploadedBy}
                                      />
                                    </div>)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* summary */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3">
                          Summary
                        </h3>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span>Rs. {order.subtotal?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Shipping</span>
                            <span>Rs. {order.shipping?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tax</span>
                            <span>Rs. {order.tax?.toFixed(2)}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-100 flex justify-between font-semibold text-gray-900">
                            <span>Total</span>
                            <span className="text-emerald-600">
                              Rs. {order.total?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-xs text-emerald-700">
                          Order placed on {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
