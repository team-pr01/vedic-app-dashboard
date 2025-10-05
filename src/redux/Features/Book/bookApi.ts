import { baseApi } from "../../API/baseApi";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooks: builder.query<any, { keyword?: string }>({
      query: ({ keyword = "" }) => {
        return {
          url: `/books?keyword=${encodeURIComponent(keyword)}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["books"],
    }),

    getSingleBook: builder.query({
      query: (id) => ({
        url: `/book/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["book"],
    }),

    createBook: builder.mutation<any, any>({
      query: (data) => ({
        url: `/book/create-book`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["book"],
    }),

    deleteBook: builder.mutation<
      any,
      { id: string }
    >({
      query: ({id}) => ({
        url: `/book/delete-book/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["book"],
    }),

    updateBook: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/book/update-book/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["book"],
    }),

    // Chapter apis
    addChapter: builder.mutation<any, any>({
      query: ({data, id}) => ({
        url: `/book/add-chapters/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["book"],
    }),

    // Chapter apis
    addSlokOrMantra: builder.mutation<any, any>({
      query: ({data, id, chapterIndex}) => ({
        url: `/book/${id}/chapters/${chapterIndex}/slokOrMantra`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["book"],
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useGetSingleBookQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
  useAddChapterMutation,
  useAddSlokOrMantraMutation,
} = bookApi;
