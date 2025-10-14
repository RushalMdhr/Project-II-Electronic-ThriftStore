import { useState } from "react";
import PriceRange from "./PriceRange.jsx";
import { useSearchParams } from "react-router";
import { useEffect } from "react";

const FilterSideBar = ({ filter, setFilter, categories, searchParams, setSearchParams }) => {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const sortOptions = [
    "price-high",
    "price-low",
    "newest",
    "oldest",
    "popular",
  ];
  const condition = ["Brand New", "Like New", "Refurbished", "Good", "Fair"];

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "";
    setFilter((prev) => ({ ...prev, category: categoryFromUrl }));
  }, [searchParams]);


  return (
    <aside className="bg-white p-6 rounded-lg shadow space-y-6 w-full md:w-72">
      <h2 className="text-xl font-bold mb-2 text-gray-900">Filters</h2>

      {/* Price Range */}
      <div>
        <label className="block mb-2 font-bold text-gray-700">
          Price Range:{" "}
          <span className="font-normal">
            ${filter.min} - ${filter.max}
          </span>
        </label>

        <PriceRange filter={filter} setFilter={setFilter} />
      </div>

      {/* Manual price input */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min</label>
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
          <label className="block text-sm font-medium text-gray-700">Max</label>
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

      {/* Condition */}
      <div>
        <label className="block font-medium mb-1 text-gray-700">
          Condition
        </label>
        <select
          value={filter.condition || ""}
          onChange={(e) => setFilter({ ...filter, condition: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Any</option>
          {condition.map((con, idx) => (
            <option key={idx} value={con}>
              {con}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Categories
        </label>

        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto shadow-sm shadow-black/50 rounded p-2 bg-white">
          {categories?.map((cat) => (
            <label
              key={cat._id}
              className="inline-flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                value={cat._id} // ✅ using the ID
                checked={filter.category === cat._id}
                onChange={() => {
                  setFilter({ ...filter, category: cat._id }); // ✅ store ID in filter

                  // Update URL query param
                  setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set("category", cat._id); // ✅ URL stores the ID
                    params.set("page", 1);
                    return params;
                  });
                }}
                className="form-radio h-4 w-4 text-emerald-600"
              />

              <span className="text-gray-700">{cat.name}</span>
            </label>
          ))}
          
          {/* Optional: None / Default */}
          <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="radio"
              name="category"
              value=""
              checked={!filter.category}
              onChange={() => setFilter({ ...filter, category: "" })}
              className="form-radio h-4 w-4 text-emerald-600"
            />
            <span className="text-gray-700">All Categories</span>
          </label>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block font-medium mb-1 text-gray-700">Sort By</label>
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
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
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
        className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded font-medium mt-4"
      >
        Reset Filters
      </button>
    </aside>
  );
};

export default FilterSideBar;
