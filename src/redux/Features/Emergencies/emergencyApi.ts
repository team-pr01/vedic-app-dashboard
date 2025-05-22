import { baseApi } from "../../API/baseApi";

const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmergencies: builder.query<any, { keyword?: string; status?: string }>({
  query: ({ keyword = "", status = "" }) => {
    return {
      url: `/emergency?keyword=${keyword}&status=${status}`,
      method: "GET",
      credentials: "include",
    };
  },
  providesTags: ["emergencies"],
}),


    getSingleEmergency: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["emergencies"],
    }),

    deleteEmergency: builder.mutation<any, string>({
      query: (id) => ({
        url: `/emergency/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["emergencies"],
    }),

    changeStatusToResolved: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/emergency/update-status/${id}`,
        method: "PUT",
        body: {status},
        credentials: "include",
      }),
      invalidatesTags: ["emergencies"],
    }),
  }),
});

export const {
  useGetAllEmergenciesQuery,
  useGetSingleEmergencyQuery,
  useDeleteEmergencyMutation,
  useChangeStatusToResolvedMutation
} = menuApi;
