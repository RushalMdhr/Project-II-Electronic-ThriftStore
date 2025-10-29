import { Link } from "react-router";
import { useGetBlackListedProductsQuery } from "../../redux/api/productsApiSlice";
import LoadingScreen from "../ui/Loading";

const BlackListedProducts = () => {
  const {
    data: blacklistedProducts,
    isLoading,
    isError,
  } = useGetBlackListedProductsQuery();

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 py-10 px-6">
      <h1 className="text-4xl font-bold text-emerald-400 mb-10 text-center drop-shadow-lg">
        Blacklisted Products
      </h1>

      {isLoading && <LoadingScreen />}
      {isError && (
        <h2 className="text-red-500 text-center text-lg">
          Something went wrong while fetching data.
        </h2>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {blacklistedProducts?.length > 0
          ? blacklistedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 border border-neutral-800 hover:border-emerald-500/50"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/overview/${product._id}`}
                      className="text-2xl font-semibold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      {product.name}
                    </Link>
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </div>

                  <span className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium shadow-md">
                    Blacklisted
                  </span>
                </div>

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

                {product.reported?.length > 0 && (
                  <div className="mt-5 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 hover:border-emerald-500/40 transition-colors duration-300">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">
                      Reports:
                    </h3>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                      {product.reported.map((report) => (
                        <li key={report._id} className="pl-1">
                          {report.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          : !isLoading && (
              <p className="text-gray-400 text-center text-lg">
                No blacklisted products found.
              </p>
            )}
      </div>
    </div>
  );
};

export default BlackListedProducts;
