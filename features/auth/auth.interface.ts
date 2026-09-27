import { LoginDto } from "./schemas/login.schema";

export interface LoginResponse {
  success: boolean;
  message: string;
  errors?: Partial<LoginDto>;
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
  updatedAt: string;
  createdAt: string;
}
