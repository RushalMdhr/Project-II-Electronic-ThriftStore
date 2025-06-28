import React from "react";

export const Card = ({ className = "", children }) => {
  return (
    <div
      className={`rounded-lg border border-gray-700 bg-gray-800 text-white shadow-md ${className}`}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className = "", children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
