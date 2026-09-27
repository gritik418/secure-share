import baseApi from "@/store/api/base-api";
import { LoginResponse } from "./auth.interface";
import { LoginDto } from "./schemas/login.schema";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (data: LoginDto) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

export default authApi;
