import { useEffect, useState, useMemo } from "react";
import {
  useListcategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import { useAllProductsQuery } from "../../redux/api/productsApiSlice";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";

const CategoryManagement = () => {
  const { data: categories = [], refetch } = useListcategoryQuery();
  const { data: products = [] } = useAllProductsQuery();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [id, setId] = useState(null);
  const [image, setImage] = useState(null);

  const handleEdit = (category) => {
    setName(category.name);
    setId(category._id);
    setImage(null); // Clear file input, image preview not implemented here
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId).unwrap();
        toast.success("Category deleted successfully");
        refetch();
        if (id === categoryId) {
          handleCancel();
        }
      } catch (err) {
        console.error(err);
        toast.error("Error deleting category");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Category name is required");

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      if (id) {
        await updateCategory({ id, formData }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created");
      }

      setName("");
      setImage(null);
      setId(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Error saving category");
    }
  };

  const handleCancel = () => {
    setName("");
    setId(null);
    setImage(null);
  };

  // Calculate product counts per category efficiently
  const categoriesWithCount = useMemo(() => {
    if (!Array.isArray(products)) {
      return categories.map((cat) => ({ ...cat, productCount: 0 }));
    }

    const countMap = products.reduce((acc, prod) => {
      if (!prod.category) return acc;
      const catId =
        typeof prod.category === "object" ? prod.category._id : prod.category;
      acc[catId] = (acc[catId] || 0) + 1;
      return acc;
    }, {});

    return categories.map((cat) => ({
      ...cat,
      productCount: countMap[cat._id] || 0,
    }));
  }, [categories, products]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#131a2b] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-[#1de9b6]">
        Manage Categories
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0f172a] p-6 rounded-lg mb-10 max-w-md"
      >
        <div className="mb-4">
          <label className="block mb-1">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#1e293b] text-white border border-gray-700 focus:ring-2 focus:ring-[#1de9b6]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-white border border-gray-700 focus:ring-2 focus:ring-[#1de9b6]"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-[#1de9b6] text-black px-6 py-2 rounded hover:bg-[#13c7a6] transition"
          >
            {id ? "Update" : "Add"} Category
          </button>

          {id && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Category List */}
        <div className="bg-[#1e293b] p-6 rounded-lg max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-[#1de9b6]">
            Existing Categories
          </h2>
          {categoriesWithCount.length > 0 ? (
            categoriesWithCount.map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center bg-[#0f172a] px-4 py-3 rounded-lg mb-3 hover:bg-[#131c31] transition"
              >
                <div className="flex items-center gap-4">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-sm text-gray-300">
                      ?
                    </div>
                  )}
                  <span className="capitalize">{cat.name}</span>
                  <span className="ml-3 text-sm text-gray-400">
                    ({cat.productCount} products)
                  </span>
                </div>

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

        {/* Donut Chart */}
        <div className="bg-[#1e293b] p-6 rounded-lg max-h-[500px]">
          <h2 className="text-xl font-semibold mb-4 text-[#1de9b6]">
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
  );
};

export default CategoryManagement;
