import { useState } from "react";
import PriceRange from "./PriceRange.jsx";

const FilterSideBar = ({ filter, setFilter, categories }) => {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Sidebar open/close
  const sortOptions = [
    "price-high",
    "price-low",
    "newest",
    "oldest",
    "popular",
  ];
  const condition = ["Brand New", "Like New", "Refurbished", "Good", "Fair"];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-50 shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Price Range Slider */}
        <div className="mb-4">
          <label className="block font-medium mb-2">
            Price Range: ${filter.min} - ${filter.max}
          </label>
          <PriceRange filter={filter} setFilter={setFilter} />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>${filter.min}</span>
            <span>${filter.max}</span>
          </div>
        </div>

        {/* Manual Price Inputs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <label className="block text-sm font-medium">Min Price</label>
            <input
              type="number"
              value={filter.min || 0}
              onChange={(e) =>
                setFilter({ ...filter, min: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Max Price</label>
            <input
              type="number"
              value={filter.max || 0}
              onChange={(e) =>
                setFilter({ ...filter, max: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Condition Dropdown */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Condition</label>
          <select
            value={filter.condition || ""}
            onChange={(e) =>
              setFilter({ ...filter, condition: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Any Condition</option>
            {condition.map((con, idx) => (
              <option key={idx} value={con}>
                {con}
              </option>
            ))}
          </select>
        </div>

        {/* Category Search */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Category</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search category..."
              value={!category ? search : category}
              onChange={(e) => setSearch(e.target.value)}
              readOnly={!!category}
              className="w-full p-2 border rounded"
            />
            {category && (
              <button
                onClick={() => {
                  setCategory("");
                  setSearch("");
                  setFilter({ ...filter, category: "" });
                }}
                className="absolute right-2 top-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>

          {search.length > 2 && !category && (
            <div className="mt-2 border rounded max-h-32 overflow-y-auto">
              {categories
                ?.filter((cat) =>
                  cat.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => {
                      setCategory(cat.name);
                      setFilter({ ...filter, category: cat._id });
                    }}
                    className="p-2 hover:bg-blue-50 cursor-pointer border-b"
                  >
                    {cat.name}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Sort By</label>
          <select
            value={filter.sort || ""}
            onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Default</option>
            {sortOptions.map((sort) => (
              <option key={sort} value={sort}>
                {sort
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => {
            setFilter({
              min: 0,
              max: 10000,
              category: "",
              condition: "",
              sort: "",
            });
            setCategory("");
            setSearch("");
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSideBar;
