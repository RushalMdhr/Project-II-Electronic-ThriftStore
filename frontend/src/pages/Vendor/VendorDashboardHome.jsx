import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#1de9b6", "#ff6384", "#36a2eb", "#ffce56", "#845ec2"];

// Mock data: products by category/connects
const data = [
  { name: "Clothing", value: 12 },
  { name: "Shoes", value: 8 },
  { name: "Accessories", value: 5 },
  { name: "Bags", value: 3 },
  { name: "Jewelry", value: 2 },
];

const VendorDashboardHome = () => (
  <div className="flex-1 p-8 bg-[#0a1120] min-h-screen">
    <h1 className="text-3xl font-bold mb-6 text-[#1de9b6]">Dashboard Overview</h1>
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Products by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default VendorDashboardHome;
