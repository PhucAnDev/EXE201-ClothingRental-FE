import { api } from "../../api/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: any;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post("/api/Auth/login", payload);
  return res.data as AuthResponse;
};

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  userId?: number;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  roleId?: number;
  message?: string;
}

export const register = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const res = await api.post("/api/Auth/register", payload);
  return res.data as RegisterResponse;
};
