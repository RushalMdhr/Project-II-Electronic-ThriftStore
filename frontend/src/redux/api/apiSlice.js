import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error) {
    const status = result.error.status;
    const message = result.error.data?.message?.toLowerCase?.();

    const currentPath = window.location.pathname;
      // Wait a bit to let the toast show, then redirect
      setTimeout(() => {
        window.location.href = "/login";
      }, 2600);
    }

  return result;
};

export const apiSlice = createApi({
  baseQuery: customBaseQuery,
  tagTypes: ["tests"],
  endpoints: () => ({}),
});
