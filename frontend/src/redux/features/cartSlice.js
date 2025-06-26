import { apiSlice } from "../api/apiSlice";
const CART_URL = "/api/cart";
export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart/addtocart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: `/cart/${cartItemId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: builder.mutation({
      query: (cartItemId) => ({
        url: `/cart/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} = cartApiSlice;
