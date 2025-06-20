import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", color: "#d9534f" }}>🚫 Unauthorized</h1>
      <p style={{ fontSize: "1.2rem" }}>
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#0275d8",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
          marginTop: "20px",
        }}
      >
        Go to Home
      </Link>
    </div>
  );
}
