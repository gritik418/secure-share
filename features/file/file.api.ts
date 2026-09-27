import baseApi from "@/store/api/base-api";
import { GetFilesDto, GetFilesResponse } from "./file.interface";

const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyFiles: builder.query<GetFilesResponse, GetFilesDto>({
      query: ({ page, limit, search, visibility }: GetFilesDto) => {
        const params: Record<string, string> = {};

        if (page) params.page = page.toString();
        if (limit) params.limit = limit.toString();
        if (search) params.search = search;
        if (visibility) params.visibility = visibility;

        return {
          url: "/file",
          method: "GET",
          params,
        };
      },
    }),
  }),
});

export const { useGetMyFilesQuery } = fileApi;
