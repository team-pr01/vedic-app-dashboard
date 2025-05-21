import { baseApi } from "../../API/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    signup: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        body: userInfo,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    verifyAccount: builder.mutation({
      query: (verifyAccountData) => ({
        url: "/auth/verify",
        method: "POST",
        body: verifyAccountData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    updateProfile: builder.mutation({
      query: (profileUpdatedData) => ({
        method: "PUT",
        url: `/auth/me/update`,
        body: profileUpdatedData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    logoutUser: builder.query({
      query: () => ({
        method: "PUT",
        url: `/auth/logout`,
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    forgotPassword: builder.mutation({
      query: (forgotPasswordData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: forgotPasswordData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    resetPassword: builder.mutation({
      query: ({resetPasswordData, token}) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: resetPasswordData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),


  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyAccountMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useLogoutUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
