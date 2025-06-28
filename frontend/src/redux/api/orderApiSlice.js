// src/redux/api/orderApiSlice.js
import { apiSlice } from "./apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders (admin)
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),
    // Get logged in user orders
    getMyOrders: builder.query({
      query: () => "/orders/myorders",
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),
    // Get order by ID
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
      keepUnusedDataFor: 5,
    }),
    // Create new order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    // Update order to paid
    updateOrderToPaid: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/pay`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),
    // Update order to delivered (admin)
    updateOrderToDelivered: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderToPaidMutation,
  useUpdateOrderToDeliveredMutation,
} = orderApiSlice;
