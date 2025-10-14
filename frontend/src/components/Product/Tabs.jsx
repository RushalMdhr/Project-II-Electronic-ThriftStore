import React, { useState } from "react";

const Tabs = ({ product }) => {
  const tabs = ["Specifications", "Reviews", "Shipping & Returns"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      {/* Tab header */}
      <div className="flex justify-center gap-2 border border-slate-700 rounded-lg overflow-hidden">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-semibold text-center transition-all duration-200
              ${
                activeTab === tab
                  ? "bg-slate-800 text-emerald-400"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-6 text-slate-300">
        {activeTab === "Specifications" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">Display</th>
                  <td className="py-2">13.3-inch Retina</td>
                  <th className="py-2 pr-4">Processor</th>
                  <td className="py-2">Apple M1</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">RAM</th>
                  <td className="py-2">8GB</td>
                  <th className="py-2 pr-4">Storage</th>
                  <td className="py-2">256GB SSD</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">Graphics</th>
                  <td className="py-2">7-core GPU</td>
                  <th className="py-2 pr-4">Battery</th>
                  <td className="py-2">Up to 18 hours</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">OS</th>
                  <td className="py-2" colSpan={3}>
                    macOS Big Sur (upgradable)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Reviews" && product && (
          <div>
            {product.reviews?.length > 0 ? (
              product.reviews.map((r) => (
                <div key={r._id} className="border-b border-slate-700 py-2">
                  <p className="font-semibold">{r.user?.username}</p>
                  <p>Rating: {r.rating} / 5</p>
                  <p>{r.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        )}

        {activeTab === "Shipping & Returns" && (
          <div>
            <p>
              Standard shipping: 3-7 business days. Free returns within 30 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
