import baseApi from "@/store/api/base-api";
import {
  GetMeResponse,
  LoginResponse,
  RegisterResponse,
} from "./auth.interface";
import { LoginDto } from "./schemas/login.schema";
import { RegisterDto } from "./schemas/register.schema";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (data: LoginDto) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (data: RegisterDto) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useRegisterMutation } = authApi;

export default authApi;
