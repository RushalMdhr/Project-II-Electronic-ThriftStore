import { Query } from "mongoose";
import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { data } from "react-router";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //mutation is used for post, put, delete where data are updated
    //query is used for get
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    // logout is used for logging out the user
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    // register is used for creating a new user
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getPendingPaymentVendors: builder.query({
      query: () => ({
        url: `${USERS_URL}/pending-payment-vendor`,
      }),
      // keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: ({ userId, ...body }) => ({
        url: `${USERS_URL}/${userId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    // Mutation for making a user a vendor (update shop info)
    makeVendor: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/vendor/shop`,
        method: "POST",
        body: data,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
    }),
    becomeAdmin: builder.mutation({
      query: () => ({
        url : `${USERS_URL}/become-admin`,
        method: "POST",
      })
    })
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useMakeVendorMutation,
  useGetPendingPaymentVendorsQuery,
  useGetCurrentUserQuery,
  useBecomeAdminMutation,
} = userApiSlice;
// http://localhost:5000/api/users/auth
// we ll request to this url
