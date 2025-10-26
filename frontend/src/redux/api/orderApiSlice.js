// src/redux/api/orderApiSlice.js
import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants"; // Make sure this exports "/api/orders"

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders (admin)
    getOrders: builder.query({
      query: () => ORDERS_URL, // "/api/orders"
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),
    // Get logged in user's orders
    getMyOrders: builder.query({
      query: () => `${ORDERS_URL}/myorders`, // "/api/orders/myorders"
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),
    // Get order by ID
    getOrderById: builder.query({
      query: (id) => `${ORDERS_URL}/${id}`, // "/api/orders/:id"
      providesTags: (result, error, id) => [{ type: "Order", id }],
      keepUnusedDataFor: 5,
    }),

    //get sold orders
    getSoldOrders: builder.query({
      query: () => `${ORDERS_URL}/soldorders`,
      providesTags: (result, error) => [{ type: "Order" }],
      keepUnusedDataFor: 5,
    }),
    // Create new order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: ORDERS_URL,
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    // Update order to paid
    updateOrderToPaid: builder.mutation({
      query: ({orderId, data}) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),
    // Update order to delivered (admin)
    updateOrderToDelivered: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
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
  useGetSoldOrdersQuery,
} = orderApiSlice;
