import { baseApi } from "../../API/baseApi";

const bookTextApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTexts: builder.query<any, { keyword?: string }>({
      query: ({ keyword = "" }) => {
        return {
          url: `/book-text?keyword=${encodeURIComponent(keyword)}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["texts"],
    }),

    getSingleText: builder.query({
      query: (id) => ({
        url: `/book-text/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["texts"],
    }),

    getTextByDetails: builder.query({
      query: ({
        bookId,
        levels,
      }: {
        bookId: string;
        levels?: Record<string, string>;
      }) => {
        if (!bookId) return { url: "", method: "GET" };

        const safeLevels = levels || {};
        const params = new URLSearchParams({ bookId });

        Object.entries(safeLevels).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        return {
          url: `/book-text/find-by-details?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["texts"],
    }),

    addText: builder.mutation<any, any>({
      query: (data) => ({
        url: `/book-text/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["texts"],
    }),

    deleteText: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/book-text/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["texts"],
    }),

    updateText: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/book-text/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["texts"],
    }),
  }),
});

export const {
  useGetAllTextsQuery,
  useGetSingleTextQuery,
  useGetTextByDetailsQuery,
  useAddTextMutation,
  useDeleteTextMutation,
  useUpdateTextMutation,
} = bookTextApi;
