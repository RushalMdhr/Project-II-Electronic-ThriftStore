import { useState } from "react";
import {
  useListcategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApiSlice";

const Category = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState(null);

  const { data: categories = [], refetch } = useListcategoryQuery();
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

        {/* Category List Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#1de9b6] mb-4">
            Existing Categories
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex justify-between items-center bg-[#0f172a] px-4 py-3 rounded-lg transition hover:bg-[#131c31]"
                >
                  <span className="capitalize text-white">{cat.name}</span>
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
      </div>
    </div>
  );
};

export default Category;
