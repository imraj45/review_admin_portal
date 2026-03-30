import { apiSlice } from './apiSlice'

interface User {
  _id: string
  email: string
  role: string
}

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  user: User
}

interface RegisterRequest {
  email: string
  password: string
  role: string
}

interface ForgotPasswordRequest {
  email: string
}

interface ForgotPasswordResponse {
  message: string
  resetToken: string
}

interface ResetPasswordRequest {
  token: string
  newPassword: string
}

interface ResetPasswordResponse {
  message: string
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi
