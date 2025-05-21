import { baseApi } from "../../API/baseApi";

const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        makePayment: builder.mutation({
            query: (paymentData) => ({
              url: "/subscription/create",
              method: "POST",
              body: paymentData,
              credentials: "include",
            }),
            invalidatesTags: ["payment"],
          }),

        verifyPayment: builder.mutation({
            query: (sessionId) => ({
              url: "/subscription/confirm-subscription",
              method: "POST",
              body: sessionId,
              credentials: "include",
            }),
            invalidatesTags: ["payment"],
          }),
    }),
});

export const {
    useMakePaymentMutation,
    useVerifyPaymentMutation,
} = paymentApi;
