import { apiSlice } from "./apiSlice";

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new review
    createReview: builder.mutation({
      query: (formData) => ({
        url: `/api/reviews`,
        method: "POST",
        body: formData,
      }),
    }),

    // Get reviews of a product
    getReviewsByProduct: builder.query({
      query: (productId) => `/api/reviews/product/${productId}`,
      providesTags: ["Reviews"],
    }),

    // Get reviews of a seller
    getReviewsBySeller: builder.query({
      query: (sellerId) => `/api/reviews/seller/${sellerId}`,
      providesTags: ["Reviews"],
    }),

    // Delete a review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/api/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});


export const {
  useCreateReviewMutation,
  useGetReviewsByProductQuery,
  useGetReviewsBySellerQuery,
  useDeleteReviewMutation,
} = reviewApiSlice;
