import { baseApi } from "../../API/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMySubscription: builder.query({
            query: () => ({
                url: "/subscription/me",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["subscription"],
        }),



    }),
});

export const {
    useGetMySubscriptionQuery
} = subscriptionApi;
