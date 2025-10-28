import React from "react";
import ReactApexChart from "react-apexcharts";

const DashboardChart = ({
  title,
  data = [],
  dataKey,
  xAxisKey = "_id",
  lineColor = "#4F46E5",
  type = "line", // new prop to support 'line' or 'donut'
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  let series = [];
  let options = {};

  if (type === "line") {
    series = [
      {
        name: dataKey,
        data: data.map((item) => item[dataKey] ?? 0),
      },
    ];

    options = {
      chart: {
        type: "line",
        background: "transparent",
        zoom: { enabled: true, type: "x", autoScaleYaxis: true },
        toolbar: { show: true },
      },
      xaxis: {
        categories: data.map((item) => item[xAxisKey] ?? ""),
        labels: { style: { colors: "#ccc" } },
      },
      yaxis: { labels: { style: { colors: "#ccc" } } },
      stroke: { curve: "smooth", width: 2, colors: [lineColor] },
      grid: { borderColor: "#555", strokeDashArray: 5 },
      tooltip: { theme: "dark" },
      dataLabels: { enabled: false },
      title: { text: title, align: "left", style: { color: "#fff" } },
    };
  } else if (type === "donut") {
    series = data.map((item) => item[dataKey] ?? 0);

    options = {
      chart: { type: "donut", background: "transparent" },
      labels: data.map((item) => item[xAxisKey] ?? ""),
      legend: { position: "bottom", labels: { colors: "#ccc" } },
      dataLabels: { style: { colors: ["#ccc"] } },
      tooltip: { theme: "dark" },
      title: { text: title, align: "left", style: { color: "#fff" } },
      stroke: { width: 0 }, // <-- remove white border
      plotOptions: {
        pie: {
          donut: {
            size: "45%", // smaller % = thicker donut, default ~50%
          },
        },
      },
    };
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
      <ReactApexChart
        options={options}
        series={series}
        type={type}
        height={350}
      />
    </div>
  );
};

export default DashboardChart;
