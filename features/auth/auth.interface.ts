import { LoginDto } from "./schemas/login.schema";

export interface LoginResponse {
  success: boolean;
  message: string;
  errors?: Partial<LoginDto>;
}
