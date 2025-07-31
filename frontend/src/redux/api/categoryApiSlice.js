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
      invalidatesTags: ["Category", "Product"], // invalidate products too if counts depend on products
    }),

    updateCategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Category", "Product"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Product"],
    }),

    listcategory: builder.query({
      query: () => `${CATEGORY_URL}`,
      providesTags: (result = [], error, arg) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Category", id: _id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getTopCategories: builder.query({
      query: () => `${CATEGORY_URL}/topcategories`,
      providesTags: ["Category"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useListcategoryQuery,
  useGetTopCategoriesQuery,
} = categoryApiSlice;
