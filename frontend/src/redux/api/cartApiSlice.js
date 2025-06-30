import { apiSlice } from "../api/apiSlice";
import { CART_URL } from "../constants";;

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Add to cart
    addToCart: builder.mutation({
       query: ({ userId, productId, quantity }) => ({
    url: `${ CART_URL }/add`,
    method: "POST",
    body: { userId, productId, quantity },
      }),
    }),

    // Get all cart items for a user
    getCartItems: builder.query({
      query: (userId) => `${ CART_URL }/${userId}`,
    }),

    // Increment or decrement quantity
    updateCartItem: builder.mutation({
      query: ({ id, action }) => ({
        url: `${ CART_URL }/${id}`,
        method: "PUT",
        body: { action },
      }),
    }),

    // Delete item from cart
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `${ CART_URL }/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartItemsQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} = cartApiSlice;
