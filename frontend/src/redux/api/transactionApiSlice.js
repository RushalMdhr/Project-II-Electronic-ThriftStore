import { ESEWA_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    esewaPayment: builder.mutation({
      query: (data) => ({
        url: `${ESEWA_URL}/initiate-payment`,
        method: "POST",
        body: data,
      }),
    }),

    esewaSuccess: builder.mutation({
      query: ({product_id}) => ({
        url: `${ESEWA_URL}/payment-status`,
        method: "POST",
        body : {product_id},
      }),
    }),
  }),
});

export const { useEsewaPaymentMutation, useEsewaSuccessMutation } = transactionApiSlice;
