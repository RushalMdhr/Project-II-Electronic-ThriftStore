// redux/api/vendorApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { VENDOR_URL } from "../constants";

// Adjust baseUrl according to your backend
export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${VENDOR_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => "/dashboard",
    }),
    getSalesGrowth: builder.query({
      query: () => "/sales-growth",
    }),
    getCategoryRange: builder.query({
      query: () => "/category-range",
    }),
    getRecentOrders: builder.query({
      query: () => "/recent-orders",
    }),
    getVendorProfile: builder.query({
      query: () => "/profile",
    }),
  }),
});

// Export hooks for components
export const {
  useGetDashboardQuery,
  useGetSalesGrowthQuery,
  useGetCategoryRangeQuery,
  useGetRecentOrdersQuery,
  useGetVendorProfileQuery,
} = vendorApi;
