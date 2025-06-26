import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DashboardChart = ({
  title,
  data,
  dataKey,
  xAxisKey = "_id",
  lineColor = "#4F46E5",
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {data && data.length > 0 ? (
        <LineChart width={800} height={300} data={data}>
          <XAxis dataKey={xAxisKey} stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <CartesianGrid stroke="#555" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={lineColor}
            strokeWidth={2}
          />
        </LineChart>
      ) : (
        <p className="text-gray-400">No data available</p>
      )}
    </div>
  );
};

export default DashboardChart;
