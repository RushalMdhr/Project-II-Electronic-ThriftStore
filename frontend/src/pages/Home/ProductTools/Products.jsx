import React, { useEffect } from 'react';
import ProductGrid from './ProductGrid';
import { useGetProductsQuery } from '../../../redux/api/productsApiSlice';
import { useLocation, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { state } = useLocation();
  const searched = state?.Search || null; // Handle case where no product is provided
  console.log(searched)

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
      Count : {productPage.count || 0}
      <ProductGrid products={productPage.products || []} />
      <button
        className="border-block bg-gray-500 rounded-2xl px-4 py-5 m-3"
        onClick={() => GoBack(currentPage - 1)}
        disabled={productPage.page <= 1}
      >
        Back
      </button>
      page : {currentPage}/{productPage.pages}
      <button
        className="border-block bg-gray-500 rounded-2xl px-4 py-5 m-3"
        onClick={() => GoNext(currentPage + 1)}
        disabled={!productPage.hasMore}
      >
        Next
      </button>
    </div>
  );
};

export default Products;
