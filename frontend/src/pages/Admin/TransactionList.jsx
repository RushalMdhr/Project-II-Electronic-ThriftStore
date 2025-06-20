// TransactionHistoryAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionHistoryAdmin() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [page, search, statusFilter]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions", {
        params: { page, search, status: statusFilter, limit: 10 },
      });
      setTransactions(res.data.transactions);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div>
      <h2>Transaction History</h2>

      <input
        type="text"
        placeholder="Search description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="success">Success</option>
        <option value="failed">Failed</option>
        <option value="pending">Pending</option>
      </select>

      <table border="1" cellPadding="8" cellSpacing="0">
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
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>{t.userId?.username || "N/A"}</td>
              <td>${t.amount.toFixed(2)}</td>
              <td>{new Date(t.transactionDate).toLocaleString()}</td>
              <td>{t.status}</td>
              <td>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
