import React from "react";

const variantStyles = {
  success: "bg-green-600 text-white",
  destructive: "bg-red-600 text-white",
  secondary: "bg-gray-500 text-white",
  default: "bg-gray-700 text-white",
};

export const Badge = ({ variant = "default", className = "", children }) => {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
