import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetBlackListedProductsQuery,
  useAddToBlackListMutation,
  useRemoveReportMutation,
} from "../../redux/api/productsApiSlice";
import LoadingScreen from "../ui/Loading";

const BlackListedProducts = () => {
  const {
    data: blacklistedProducts,
    isLoading,
    isError,
  } = useGetBlackListedProductsQuery();

  const [blacklistProduct, { isLoading: isBlacklisting }] =
    useAddToBlackListMutation();

  const [removeReport] = useRemoveReportMutation();

  const [removingReports, setRemovingReports] = useState({});
  const [localBlacklist, setLocalBlacklist] = useState({}); // optimistic state

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral-950 text-red-500 text-lg">
        Something went wrong while fetching data.
      </div>
    );
  }

  const handleRemoveReport = async (productId, userId) => {
    try {
      setRemovingReports((prev) => ({ ...prev, [userId]: true }));
      await removeReport({ productId, userId }).unwrap();
      alert("Report deleted ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to delete report ❌");
    } finally {
      setRemovingReports((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleAddToBlacklist = async (productId) => {
    try {
      // Optimistic update
      setLocalBlacklist((prev) => ({ ...prev, [productId]: true }));
      await blacklistProduct({ productId }).unwrap();
      alert("Product added to blacklist ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to add to blacklist ❌");
      setLocalBlacklist((prev) => ({ ...prev, [productId]: false })); // rollback
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 py-10 px-6">
      <h1 className="text-4xl font-bold text-emerald-400 mb-10 text-center drop-shadow-lg">
        Blacklisted Products
      </h1>

      {blacklistedProducts?.length > 0 ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {blacklistedProducts.map((product) => {
            const isBlacklisted =
              product.blackListed || localBlacklist[product._id];

            return (
              <div
                key={product._id}
                className="bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 shadow-lg 
              hover:shadow-emerald-500/30 transition-all duration-300 border border-neutral-800 
              hover:border-emerald-500/50"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/overview/${product._id}`}
                      className="text-2xl font-semibold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      {product.name}
                    </Link>
                  </div>

                  {/* Blacklist Badge or Button */}
                  <div className="flex items-center gap-2">
                    {isBlacklisted ? (
                      <span className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium shadow-md flex items-center gap-2 cursor-not-allowed">
                        <span className="w-3 h-3 bg-white rounded-full"></span>
                        Blacklisted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToBlacklist(product._id)}
                        disabled={isBlacklisting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium shadow-md disabled:opacity-50"
                      >
                        {isBlacklisting
                          ? "Blacklisting..."
                          : "Add to Blacklist"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-1 text-sm text-gray-400">
                  <p>
                    <span className="text-gray-300 font-medium">Price:</span> $
                    {product.price}
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Reports:</span>{" "}
                    {product.reportsCount}
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Views:</span>{" "}
                    {product.viewsCount}
                  </p>
                  <p>
                    <span className="text-gray-300 font-medium">Report %:</span>{" "}
                    {product.reportPercentage}%
                  </p>
                </div>

                {/* Reports */}
                {product.reported?.length > 0 && (
                  <div className="mt-5 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 hover:border-emerald-500/40 transition-colors duration-300">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">
                      Reports:
                    </h3>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                      {product.reported.map((report) => (
                        <li
                          key={report.user}
                          className="flex justify-between items-center"
                        >
                          <span>{report.reason}</span>
                          <button
                            onClick={() =>
                              handleRemoveReport(product._id, report.user)
                            }
                            disabled={removingReports[report.user]}
                            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                          >
                            {removingReports[report.user]
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-center text-lg">
          No blacklisted products found.
        </p>
      )}
    </div>
  );
};

export default BlackListedProducts;
