import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../constants";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page,keyword }) => ({
        url: `${PRODUCT_URL}`,
        params: { page,keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/`,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProductDetails: builder.mutation({
      query: (productId, data) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: data,
      }),
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      providesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (productId, data) => ({
        url: `${PRODUCT_URL}/${productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),

    getTopProduct: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),
    
    getMyProducts: builder.query({
      query: () => `${PRODUCT_URL}/getmyproducts`,
      providesTags: ["Product"],
    }),

    increaseViewCount : builder.mutation({
      query : (productId)=>({
        url : `${PRODUCT_URL}/${productId}/views`,
        method : "PUT",
      })
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductDetailsMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetMyProductsQuery,
  useIncreaseViewCountMutation
} = productApiSlice;
