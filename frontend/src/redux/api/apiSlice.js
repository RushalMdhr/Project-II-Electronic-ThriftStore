import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

let hasLoggedOut = false; // 🛑 Prevent infinite toasts/redirects

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error) {
    const status = result.error.status;
    const message = result.error.data?.message?.toLowerCase?.();

    const shouldLogout =
      status === 401 ||
      status === 403 ||
      message?.includes("banned") ||
      message?.includes("token") ||
      message?.includes("not authorized") ||
      message?.includes("unauthorized");

    const currentPath = window.location.pathname;
    const isOnAuthPage =
      currentPath === "/login" ||
      currentPath === "/register" ||
      currentPath === "/unauthorized";

    if (shouldLogout && !isOnAuthPage && !hasLoggedOut) {
      hasLoggedOut = true; // ✅ prevent infinite redirect

      localStorage.removeItem("userInfo");

      toast.error(
        "You have been logged out. Reason: " + (message || "Session expired"),
        { autoClose: 2500 }
      );

      // Wait a bit to let the toast show, then redirect
      setTimeout(() => {
        window.location.href = "/login";
      }, 2600);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: customBaseQuery,
  tagTypes: ["Products", "Users", "Orders", "Category", "Reviews"],
  endpoints: () => ({}),
});
