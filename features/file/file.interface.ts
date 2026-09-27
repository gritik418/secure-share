export type FileVisibility = "PRIVATE" | "ANYONE_WITH_LINK";

export interface GetFilesResponse {
  success: boolean;
  data: {
    files: FileInterface[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface GetFilesDto {
  page?: number;
  limit?: number;
  search?: string;
  visibility?: FileVisibility;
}

export interface FileInterface {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  storagePath: string;
  visibility: FileVisibility;
  accessLink: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
