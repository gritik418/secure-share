import { LoginDto } from "./schemas/login.schema";
import { RegisterDto } from "./schemas/register.schema";

export interface LoginResponse {
  success: boolean;
  message: string;
  errors?: Partial<LoginDto>;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  errors?: Partial<RegisterDto>;
}

export interface GetMeResponse {
  success: boolean;
  message: string;
  data?: { user: User };
}

export interface User {
  id: string;
  name: string;
  email: string;

  uploadedFilesCount: number;
  sharedToMeCount: number;
  sharedByMeCount: number;

  updatedAt: string;
  createdAt: string;
}
