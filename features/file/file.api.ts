import baseApi from "@/store/api/base-api";
import {
  AddFileMemberDto,
  AddFileMemberResponse,
  DeleteFileResponse,
  GetFilesDto,
  GetMyFilesResponse,
  GetReceivedFilesResponse,
  RemoveFileMemberDto,
  RemoveFileMemberResponse,
} from "./file.interface";

const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyFiles: builder.query<GetMyFilesResponse, GetFilesDto>({
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
      providesTags: ["File"],
    }),
    getReceivedFiles: builder.query<GetReceivedFilesResponse, void>({
      query: () => {
        return {
          url: "/file/received",
          method: "GET",
        };
      },
      providesTags: ["File"],
    }),
    addFileMember: builder.mutation<AddFileMemberResponse, AddFileMemberDto>({
      query: ({ fileId, email }: AddFileMemberDto) => ({
        url: `/file/${fileId}/members`,
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["File"],
    }),
    removeFileMember: builder.mutation<
      RemoveFileMemberResponse,
      RemoveFileMemberDto
    >({
      query: ({ fileId, email }: RemoveFileMemberDto) => ({
        url: `/file/${fileId}/members`,
        method: "DELETE",
        body: { email },
      }),
      invalidatesTags: ["File"],
    }),
    deleteFile: builder.mutation<DeleteFileResponse, string>({
      query: (fileId: string) => ({
        url: `/file/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["File"],
    }),
  }),
});

export const {
  useGetMyFilesQuery,
  useAddFileMemberMutation,
  useDeleteFileMutation,
  useRemoveFileMemberMutation,
  useGetReceivedFilesQuery,
} = fileApi;
