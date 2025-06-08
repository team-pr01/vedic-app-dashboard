import { baseApi } from "../../API/baseApi";

const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllContents: builder.query<any, { keyword?: string }>({
      query: () => {
        return {
          url: `/content`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["popup"],
    }),

    getSingleContent: builder.query({
      query: (id) => ({
        url: `/content/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["popup"],
    }),

    addContent: builder.mutation<any, any>({
      query: (data) => ({
        url: `/content/create-content`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["popup"],
    }),

    deleteContent: builder.mutation<
      any,
      { contentId: string; type: "image" | "video"; url: string }
    >({
      query: ({ contentId, type, url }) => ({
        url: `/content/delete-content/${contentId}/${type}/${encodeURIComponent(url)}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["popup"],
    }),

    updateContent: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/popup/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["popup"],
    }),
  }),
});

export const {
  useGetAllContentsQuery,
  useGetSingleContentQuery,
  useAddContentMutation,
  useDeleteContentMutation,
  useUpdateContentMutation,
} = contentApi;
