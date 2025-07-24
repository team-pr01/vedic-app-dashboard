import { baseApi } from "../../../API/baseApi";


const reelCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReelCategories: builder.query({
      query: () => {
        return {
          url: `/reelCategory`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["reelCategory"],
    }),

    getSingleReelCategory: builder.query({
      query: (id) => ({
        url: `/reelCategory/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["reelCategory"],
    }),

    addReelCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: `/reelCategory/add-category`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["reelCategory"],
    }),

    deleteReelCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reelCategory/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["reelCategory"],
    }),
  }),
});

export const {
  useGetAllReelCategoriesQuery,
  useGetSingleReelCategoryQuery,
  useAddReelCategoryMutation,
  useDeleteReelCategoryMutation,
} = reelCategoryApi;
