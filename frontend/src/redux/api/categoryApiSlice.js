import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    updateCategory: builder.mutation({
      query: ({id, name}) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PUT",
        body: {name},
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    
    listcategory: builder.query({
      query: () => `${CATEGORY_URL}`,
    }),
  }),
});

export const {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useListcategoryQuery,
} = categoryApiSlice