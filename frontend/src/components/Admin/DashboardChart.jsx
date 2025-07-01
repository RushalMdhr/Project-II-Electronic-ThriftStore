import React from "react";
import ReactApexChart from "react-apexcharts";

const DashboardChart = ({
  title,
  data,
  dataKey,
  xAxisKey = "_id",
  lineColor = "#4F46E5",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const series = [
    {
      name: dataKey,
      data: data.map((item) => item[dataKey]),
    },
  ];

  const options = {
    chart: {
      type: "line",
      background: "transparent",
      zoom: {
        enabled: true,
        type: "x", // zoom horizontally
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    xaxis: {
      categories: data.map((item) => item[xAxisKey]),
      labels: {
        style: {
          colors: "#ccc",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#ccc",
        },
      },
    },
    grid: {
      borderColor: "#555",
      strokeDashArray: 5,
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: [lineColor],
    },
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={300}
        width={800}
      />
    </div>
  );
};

export default DashboardChart;
