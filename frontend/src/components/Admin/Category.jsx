import { useState, useMemo } from "react";
import {
  useListcategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import { useAllProductsQuery } from "../../redux/api/productsApiSlice";

import Chart from "react-apexcharts";

const Category = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState(null);

  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: errorCategories,
    refetch,
  } = useListcategoryQuery();

  const {
    data: products = [],
    isLoading: loadingProducts,
    error: errorProducts,
  } = useAllProductsQuery();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCategory({ id, name }).unwrap();
      } else {
        await createCategory({ name }).unwrap();
      }
      setName("");
      setId(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setId(cat._id);
  };

  const handleCancel = () => {
    setName("");
    setId(null);
  };

  const handleDelete = async (catId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) return;

    try {
      await deleteCategory(catId).unwrap();
      if (id === catId) {
        setName("");
        setId(null);
      }
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Memoize to avoid recalculating on every render
  const categoriesWithCount = useMemo(() => {
    // Defensive check: make sure products is an array
    if (!Array.isArray(products)) {
      return categories.map((cat) => ({ ...cat, productCount: 0 }));
    }

    // Step 1: Build count map from products in one pass
    const countMap = products.reduce((acc, prod) => {
      if (!prod.category) return acc;
      const catId =
        typeof prod.category === "object" ? prod.category._id : prod.category;
      acc[catId] = (acc[catId] || 0) + 1;
      return acc;
    }, {});

    // Step 2: Map categories and assign counts from map
    return categories.map((cat) => ({
      ...cat,
      productCount: countMap[cat._id] || 0,
    }));
  }, [categories, products]);

  // Loading and error handling
  if (loadingCategories || loadingProducts) {
    return (
      <div className="text-center p-10 text-[#1de9b6]">
        Loading categories and products...
      </div>
    );
  }

  if (errorCategories || errorProducts) {
    return (
      <div className="text-center p-10 text-red-500">
        Error loading categories or products.
      </div>
    );
  }

  return (
    <div className="bg-[#131a2b] min-h-screen px-10 py-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-3xl text-[#1de9b6] font-bold">
            Manage Categories
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Create, edit, and view all product categories.
          </p>
        </div>
        <div>
          <span className="text-sm bg-[#1de9b6]/10 text-[#1de9b6] px-3 py-1 rounded-full font-medium">
            Total: {categories.length}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Add Category Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#1de9b6] mb-4">
            {id ? "Update Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {id && (
              <p className="text-sm text-yellow-400">
                Editing: <span className="font-semibold">{name}</span>
              </p>
            )}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-white border border-gray-700 focus:ring-2 focus:ring-[#1de9b6] focus:outline-none"
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#1de9b6] text-black font-semibold px-4 py-2 rounded hover:bg-[#14cba8] transition"
              >
                {id ? "Update" : "Add"}
              </button>
              {id && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm text-gray-400 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Category List + Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category List */}
          <div className="bg-[#1e293b] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#1de9b6] mb-4">
              Existing Categories
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {categoriesWithCount.length > 0 ? (
                categoriesWithCount.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex justify-between items-center bg-[#0f172a] px-4 py-3 rounded-lg transition hover:bg-[#131c31]"
                  >
                    <span className="capitalize text-white">
                      {cat.name} ({cat.productCount})
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-sm text-[#1de9b6] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No categories found.</p>
              )}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-[#1e293b] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#1de9b6] mb-4">
              Product Distribution
            </h2>
            <Chart
              type="donut"
              width="100%"
              height={320}
              series={categoriesWithCount.map((cat) => cat.productCount)}
              options={{
                labels: categoriesWithCount.map((cat) => cat.name),
                colors: ["#1de9b6", "#f59e0b", "#3b82f6", "#10b981", "#f43f5e"],
                legend: {
                  show: true,
                  position: "right",
                  labels: {
                    colors: "#fff",
                    formatter: function (val, opts) {
                      const seriesIndex = opts.seriesIndex;
                      const count = opts.w.config.series[seriesIndex];
                      const total = opts.w.globals.seriesTotals.reduce(
                        (a, b) => a + b,
                        0
                      );
                      const percent = ((count / total) * 100).toFixed(1);
                      return `${val} - ${percent}% (${count})`;
                    },
                  },
                  markers: {
                    width: 12,
                    height: 12,
                    radius: 6,
                  },
                  itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                  },
                },
                tooltip: {
                  theme: "dark",
                  y: { formatter: (val) => `${val} products` },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: false,
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "65%",
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: "Total",
                          fontSize: "16px",
                          color: "#fff",
                          formatter: () =>
                            categoriesWithCount.reduce(
                              (sum, cat) => sum + cat.productCount,
                              0
                            ),
                        },
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
