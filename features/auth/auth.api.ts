import baseApi from "@/store/api/base-api";
import { GetMeResponse, LoginResponse } from "./auth.interface";
import { LoginDto } from "./schemas/login.schema";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (data: LoginDto) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;

export default authApi;
