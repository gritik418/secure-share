export type FileVisibility = "PRIVATE" | "ANYONE_WITH_LINK";

export interface GetMyFilesResponse {
  success: boolean;
  data: {
    files: MyFileInterface[];
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

export interface AddFileMemberDto {
  fileId: string;
  email: string;
}

export interface RemoveFileMemberDto {
  fileId: string;
  email: string;
}

export interface AddFileMemberResponse {
  success: boolean;
  message: string;
}

export interface RemoveFileMemberResponse {
  success: boolean;
  message: string;
}

export interface GetFilesDto {
  page?: number;
  limit?: number;
  search?: string;
  visibility?: FileVisibility;
}

export interface GetReceivedFilesDto {
  page?: number;
  limit?: number;
  search?: string;
}

export interface MyFileInterface {
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
  shares: {
    email: string;
  }[];
}

export interface GetReceivedFilesResponse {
  success: boolean;
  message: string;
  data?: {
    files: ReceivedFileInterface[];
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

export interface ReceivedFileInterface {
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
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export interface DeleteFileResponse {
  success: boolean;
  message: string;
}
