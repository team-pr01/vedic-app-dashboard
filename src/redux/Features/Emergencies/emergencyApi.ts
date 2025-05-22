import { baseApi } from "../../API/baseApi";

const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmergencies: builder.query<any, string | void>({
      query: (type) => {
        const url = type ? `/emergency?status=${type}` : "/emergency";
        return {
          url,
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
  }),
});

export const { useGetAllEmergenciesQuery, useGetSingleEmergencyQuery } =
  menuApi;
