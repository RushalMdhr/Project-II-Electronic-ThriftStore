import { ESEWA_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    esewaPayment : builder.mutation({
        query : (data)=>({
            url : `${ESEWA_URL}/initiate-payment`,
            method : "POST",
            body : data
        }),
    })
  }),
});

export const {
    useEsewaPaymentMutation
}=transactionApiSlice