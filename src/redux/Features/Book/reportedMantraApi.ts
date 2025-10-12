import { baseApi } from "../../API/baseApi";

const reportedMantraApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReportedMantras: builder.query<any, { status?: string }>({
      query: ({ status = "" }) => {
        return {
          url: `/reportMantra?status=${encodeURIComponent(status)}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["reportMantra"],
    }),

    getSingleReportedMantra: builder.query({
      query: (id) => ({
        url: `/reportMantra/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["reportMantra"],
    }),

    reportMantra: builder.mutation<any, any>({
      query: (data) => ({
        url: `/reportMantra/report`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["reportMantra"],
    }),

    deleteReportedMantra: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/reportMantra/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["reportMantra"],
    }),

    updateStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/reportMantra/update-status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["reportMantra"],
    }),
  }),
});

export const {
  useGetAllReportedMantrasQuery,
  useGetSingleReportedMantraQuery,
  useReportMantraMutation,
  useDeleteReportedMantraMutation,
  useUpdateStatusMutation,
} = reportedMantraApi;
