import { baseApi } from "../../API/baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<any, { keyword?: string }>({
      query: () => {
        return {
          url: `/notification`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["news"],
    }),

    getSingleNotification: builder.query({
      query: (id) => ({
        url: `/notification/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["news"],
    }),

    sendNotification: builder.mutation<any, any>({
      query: (data) => ({
        url: `/notification/send-notification`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["news"],
    }),

    deleteNotification: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notification/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["news"],
    }),

    // updateNews: builder.mutation<any, any>({
    //   query: ({ id, data }) => ({
    //     url: `/news/${id}`,
    //     method: "PUT",
    //     body: data,
    //     credentials: "include",
    //   }),
    //   invalidatesTags: ["news"],
    // }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetSingleNotificationQuery,
  useSendNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;
