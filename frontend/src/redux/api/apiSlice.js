import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
//           to="/login"
import { BASE_URL } from "../constants";
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Products", "Users", "Orders", "Category"],
  endpoints: () => ({}),
});
