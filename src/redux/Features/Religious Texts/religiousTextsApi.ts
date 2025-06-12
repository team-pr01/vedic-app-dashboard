import { baseApi } from "../../API/baseApi";

const religiousTextsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllReligiousTexts: builder.query<
      any,
      { keyword?: string; vedaName?: string }
    >({
      query: ({ keyword = "", vedaName = "" }) => {
        return {
          url: `/religiousTexts?keyword=${keyword}&vedaName=${vedaName}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["religiousTexts"],
    }),

    getSingleYoga: builder.query({
      query: (id) => ({
        url: `/yoga/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["yoga"],
    }),

    addReligiousTextsApi: builder.mutation<any, any>({
      query: (data) => ({
        url: `/religiousTexts/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["religiousTexts"],
    }),

    deleteReligiousText: builder.mutation<any, string>({
      query: (id) => ({
        url: `/religiousTexts/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["religiousTexts"],
    }),

    updateYoga: builder.mutation<any, any>({
      query: ({id, data}) => ({
        url: `/yoga/${id}`,
        method: "PUT",
        body : data,
        credentials: "include",
      }),
      invalidatesTags: ["yoga"],
    }),
  }),
});

export const {
  useGetAllReligiousTextsQuery,
  useGetSingleYogaQuery,
  useAddReligiousTextsApiMutation,
  useDeleteReligiousTextMutation,
  useUpdateYogaMutation
} = religiousTextsApi;
