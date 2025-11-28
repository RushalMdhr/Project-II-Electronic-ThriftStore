// components/Tabs.jsx
import React, { useState } from "react";

const Tabs = ({ labels, children }) => {
  const [activeTab, setActiveTab] = useState(labels[1]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      {/* ---------- tab buttons ---------- */}
      <div className="flex justify-center gap-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
        {labels.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-2 text-sm font-semibold text-center transition-all duration-200
              rounded-t-lg
              ${
                activeTab === tab
                  ? "bg-gray-200 text-green-600 shadow-inner border-b-2 border-green-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-green-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------- tab panels ---------- */}
      <div className="mt-4 bg-gray-200 border border-gray-300 rounded-lg p-6 text-gray-800 shadow-sm">
        {React.Children.toArray(children).find(
          (child) => child.props.label === activeTab
        )}
      </div>
    </div>
  );
};

export default Tabs;
