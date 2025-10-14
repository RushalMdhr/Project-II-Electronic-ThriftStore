import React, { useState } from "react";

const Tabs = ({ product }) => {
  const tabs = ["Specifications", "Reviews", "Shipping & Returns"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      {/* Tab buttons */}
      <div className="flex justify-center gap-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 px-6 py-2 text-sm font-semibold text-center transition-all duration-200
              rounded-t-lg
              ${
                activeTab === tab
                  ? "bg-gray-200 text-green-600 shadow-inner border-b-2 border-green-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-green-500"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 bg-gray-200 border border-gray-300 rounded-lg p-6 text-gray-800 shadow-sm">
        {/* Specifications */}
        {activeTab === "Specifications" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium text-gray-700">Name</th>
                  <td className="py-2">{product.name}</td>
                  <th className="py-2 pr-4 font-medium text-gray-700">Brand</th>
                  <td className="py-2">{product.brand || "N/A"}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium text-gray-700">
                    Condition
                  </th>
                  <td className="py-2">{product.condition}</td>
                  <th className="py-2 pr-4 font-medium text-gray-700">
                    Category
                  </th>
                  <td className="py-2">{product.category?.name || "N/A"}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium text-gray-700">Price</th>
                  <td className="py-2">${product.price}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium text-gray-700">
                    In Stock
                  </th>
                  <td className="py-2" colSpan={3}>
                    {product.countInStock}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium text-gray-700">
                    Uploaded By
                  </th>
                  <td className="py-2" colSpan={3}>
                    {product.uploadedBy?.username || "Unknown"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews */}
        {activeTab === "Reviews" && product && (
          <div>
            {product.reviews?.length > 0 ? (
              product.reviews.map((r) => (
                <div key={r._id} className="border-b border-gray-200 py-2">
                  <p className="font-semibold text-gray-800">
                    {r.user?.username}
                  </p>
                  <p className="text-gray-700">Rating: {r.rating} / 5</p>
                  <p className="text-gray-700">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        )}

        {/* Shipping & Returns */}
        {activeTab === "Shipping & Returns" && (
          <div className="text-gray-700">
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
