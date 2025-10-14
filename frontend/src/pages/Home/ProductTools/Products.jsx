import React, { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import {
  useGetPriceRangeQuery,
  useGetProductsQuery,
} from "../../../redux/api/productsApiSlice";
import { useLocation, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FilterSideBar from "../../../components/Product/FilterSideBar";
import { useListcategoryQuery } from "../../../redux/api/categoryApiSlice";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { state } = useLocation();
  const searched = state?.Search || null;

  const { userInfo } = useSelector((state) => state.auth);

  const { data: priceRange } = useGetPriceRangeQuery();
  const { data: categories } = useListcategoryQuery();
  const categoryQuery = searchParams.get("category") || "";


  const [filter, setFilter] = useState({
    min: 0,
    max: 10000,
    category: categoryQuery,
    sort: "",
    condition: "",
  });

  useEffect(() => {
    if (priceRange) {
      setFilter((prev) => ({
        ...prev,
        min: priceRange.minPrice,
        max: priceRange.maxPrice,
      }));
    }
  }, [priceRange]);

  const {
    data: productPage = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({
    page: currentPage,
    keyword: searched,
    ...filter,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error.data?.message || "Failed to fetch products");
    }
    refetch();
  }, [currentPage, refetch]);

  const GoBack = (pageNum) => {
    if (productPage.page > 1) {
      setSearchParams({ page: pageNum });
    }
  };

  const GoNext = (pageNum) => {
    if (productPage.hasMore) {
      setSearchParams({ page: pageNum });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-8">
      {/* Outer container: Sidebar + Main */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* 🟩 Sidebar (Filters) */}
        <aside className="md:w-72 w-full md:sticky md:top-24 self-start">
          <FilterSideBar
            filter={filter}
            setFilter={setFilter}
            categories={categories}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </aside>

        {/* 🛍️ Main Section */}
        <main className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {userInfo?.isAdmin ? "All Products" : "Shop All Products"}
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              {productPage.count || 0} products available
            </p>
            <div className="w-24 h-1 bg-emerald-500 mt-3 rounded-full"></div>
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={productPage.products || []}
            isAdmin={userInfo?.isAdmin}
          />

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-8 mb-10">
            <button
              onClick={() => GoBack(currentPage - 1)}
              disabled={productPage.page <= 1}
              className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 bg-white 
            hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </button>

            {Array.from(
              { length: productPage.pages || 1 },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setSearchParams({ page })}
                className={`px-4 py-2 rounded-md text-base font-medium transition-colors ${
                  page === currentPage
                    ? "bg-emerald-600 text-white"
                    : "text-gray-600 hover:bg-emerald-100 hover:text-emerald-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => GoNext(currentPage + 1)}
              disabled={!productPage.hasMore}
              className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 bg-white 
            hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base font-medium"
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
