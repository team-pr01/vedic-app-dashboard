import { baseApi } from "../../API/baseApi";

const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmergencies: builder.query<any, string | void>({
      query: (type) => {
        const queryParam = type && type !== "all" ? `?status=${type}` : "";
        return {
          url: `/emergency${queryParam}`,
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
  }),
});

export const {
  useGetAllEmergenciesQuery,
  useGetSingleEmergencyQuery,
  useDeleteEmergencyMutation,
} = menuApi;
