import React, { use, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import { useGetProductsQuery } from '../../../redux/api/productsApiSlice';
import { useLocation, useSearchParams } from 'react-router';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import {ChevronLeft, ChevronRight} from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { state } = useLocation();
  const searched = state?.Search || null; // Handle case where no product is provided
  console.log(searched)
  const { userInfo } = useSelector((state) => state.auth);
  console.log( "userInfo",userInfo?.isAdmin);  
  const {
    data: productPage = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery({ page: currentPage, keyword: searched });
  console.log("respond", productPage)
  useEffect(() => {
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
    <div>
      <div className='m-5 ml-60'>{/* Main Heading */}
      <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight ">
        Shop All Products
      </h1>

      {/* Subheading / Product Count */}
      <p className="text-gray-600 text-lg">
        {productPage.count || 0} products available
      </p>

      {/* Optional accent line */}
      <div className="w-24 h-1 bg-emerald-500 mt-3 rounded-full"></div></div>
      

      {/* Count : {productPage.count || 0} */}
      <ProductGrid
        products={productPage.products || []}
        isAdmin={userInfo?.isAdmin}
      />

      <div className="flex items-center justify-center gap-3 mt-6 mb-6">
        {/* Previous Button */}
        <button
          onClick={() => GoBack(currentPage - 1)}
          disabled={productPage.page <= 1}
          className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 bg-white 
      hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600 
      disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Previous
        </button>

        {/* Page Numbers */}
        {Array.from({ length: productPage.pages }, (_, i) => i + 1).map(
          (page) => (
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
          )
        )}

        {/* Next Button */}
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
    </div>
  );
};

export default Products;
