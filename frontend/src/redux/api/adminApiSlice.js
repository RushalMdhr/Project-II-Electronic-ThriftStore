import { apiSlice } from "../api/apiSlice";
import { ADMIN_SUMMARY_URL } from "../constants";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSummary: builder.query({
      query: () => ({
        url: ADMIN_SUMMARY_URL,
        method: "GET",
      }),
    }),
    getUserGrowthData: builder.query({
      query: () => "/admin/user-growth",
    }),
  }),
});

export const { useGetAdminSummaryQuery, useGetUserGrowthDataQuery } = adminApiSlice;
