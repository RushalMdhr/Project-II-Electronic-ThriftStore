import { apiSlice } from "./apiSlice";
import { TEST_URL } from "../constants";

export const testApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createObject: builder.mutation({
      query: (data) => ({
        url: `${TEST_URL}/add`,
        method: "POST",
        body: data,
      }),
    }),
    formObject : builder.mutation({
      query: (data) => ({
        url: `${TEST_URL}/addwithform`,
        method: "POST",
        body: data,
      }),
    }),
    getObjects: builder.query({
      query: () => ({
        url: `${TEST_URL}/get`,
      })
    }),
  })
});

export const {
  useGetObjectsQuery,
  useCreateObjectMutation,
  useFormObjectMutation
} = testApiSlice