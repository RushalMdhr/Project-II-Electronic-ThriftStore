import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../constants";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, keyword, productId }) => ({
        url: `${PRODUCT_URL}`,
        params: { page, keyword, productId },
      }),
      keepUnusedDataFor: 5,
      providesTags: (result) =>
        result && result.products
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product",
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/`,
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: "Product", id: _id })) : [],
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product", "Category"],
    }),

    updateProductDetails: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { productId, data }) =>
        [
          { type: "Product", id: productId },
          { type: "Product", id: "LIST" },
          // Also invalidate old and new categories if category changed
          data.category ? { type: "Category", id: data.category } : null,
        ].filter(Boolean),
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
      invalidatesTags: ["Product", "Category"],
    }),

    createReview: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCT_URL}/${productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    getTopProduct: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
      providesTags: [{ type: "Product", id: "TOP" }],
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
      providesTags: [{ type: "Product", id: "NEW" }],
    }),

    getMyProducts: builder.query({
      query: (vendorId) => `${PRODUCT_URL}/getmyproducts/${vendorId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Product", id: _id })),
              { type: "Product", id: "MY_LIST" },
            ]
          : [{ type: "Product", id: "MY_LIST" }],
    }),

    increaseViewCount : builder.mutation({
      query : (productId)=>({
        url : `${PRODUCT_URL}/${productId}/views`,
        method : "PUT",
      })
    }),

    reportProduct : builder.mutation({
      query : ({reason,productId})=>({
        url : `${PRODUCT_URL}/${productId}/reported`,
        method: "POST",
        body: {reason},
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
  useIncreaseViewCountMutation,
  useReportProductMutation
} = productApiSlice;
