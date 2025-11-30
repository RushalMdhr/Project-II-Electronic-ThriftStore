import { apiSlice } from "../api/apiSlice";
import { ADMIN_SUMMARY_URL } from "../constants";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSummary: builder.query({
      query: () => ({
        url: `${ADMIN_SUMMARY_URL}/summary`,
        method: "GET",
      }),
    }),
    getUserGrowthData: builder.query({
      query: () => `${ADMIN_SUMMARY_URL}/user-growth`,
    }),
  }),
});

export const { useGetAdminSummaryQuery, useGetUserGrowthDataQuery } = adminApiSlice;
