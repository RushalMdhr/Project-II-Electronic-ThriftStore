import React, { useState } from "react";

const Tabs = ({ product }) => {
  const tabs = ["Specifications", "Reviews", "Shipping & Returns"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      <div className="flex justify-center gap-1 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab)}
            className={`
        flex-1 px-6 py-2 text-sm font-semibold text-center transition-all duration-200
        rounded-t-lg
        ${
          activeTab === tab
            ? "bg-slate-800 text-emerald-400 shadow-inner border-b-2 border-emerald-400"
            : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-emerald-300"
        }
      `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-6 text-slate-300">
        {/* Specifications */}
        {activeTab === "Specifications" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">Name</th>
                  <td className="py-2">{product.name}</td>
                  <th className="py-2 pr-4">Brand</th>
                  <td className="py-2">{product.brand}</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">Condition</th>
                  <td className="py-2">{product.condition}</td>
                  <th className="py-2 pr-4">Category</th>
                  <td className="py-2">{product.category?.name || "N/A"}</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">Price</th>
                  <td className="py-2">${product.price}</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">In Stock</th>
                  <td className="py-2" colSpan={3}>
                    {product.countInStock}
                  </td>
                </tr>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4">Uploaded By</th>
                  <td className="py-2" colSpan={3}>
                    {product.uploadedBy?.username || "Unknown"}
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
