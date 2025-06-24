import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayFetch = setTimeout(() => {
      fetchOrders();
    }, 400); // debounce-like behavior

    return () => clearTimeout(delayFetch);
  }, [page, search, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.get("/api/Orders", {
        params: { page, search, status: statusFilter, limit: 10 },
      });

      setOrders(res.data.orders || []); // ensure backend returns `orders`
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMsg("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order History</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search description..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          style={{ padding: "5px" }}
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {loading && <p>Loading orders...</p>}

      {!loading && (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.userId?.username || "N/A"}</td>
                  <td>${order.amount.toFixed(2)}</td>
                  <td>{new Date(order.transactionDate).toLocaleString()}</td>
                  <td>{order.status}</td>
                  <td>{order.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{ marginRight: "10px" }}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
