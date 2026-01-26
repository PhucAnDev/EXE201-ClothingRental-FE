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

export interface OtpRequestPayload {
  email: string;
}

export interface OtpResponse {
  message?: string;
}

export const requestPasswordOtp = async (
  payload: OtpRequestPayload,
): Promise<OtpResponse> => {
  const res = await api.post("/api/Users/password/otp", payload);
  return res.data as OtpResponse;
};

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message?: string;
  resetToken?: string;
}

export const verifyPasswordOtp = async (
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> => {
  const res = await api.post("/api/Users/password/otp/verify", payload);
  return res.data as VerifyOtpResponse;
};

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message?: string;
}

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const res = await api.post("/api/Users/password/reset", payload);
  return res.data as ResetPasswordResponse;
};

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message?: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload,
  token?: string | null,
): Promise<ChangePasswordResponse> => {
  const res = await api.put("/api/Users/me/change-password", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as ChangePasswordResponse;
};

export interface UserDetailResponse {
  userId?: number;
  roleId?: number;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UserListResponse = UserDetailResponse[];

export const getUsers = async (
  token?: string | null,
): Promise<UserListResponse> => {
  const res = await api.get("/api/Users", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as UserListResponse;
};

export const getUserById = async (
  userId: string | number,
  token?: string | null,
): Promise<UserDetailResponse> => {
  const res = await api.get(`/api/Users/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as UserDetailResponse;
};

export interface UpdateUserProfilePayload {
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string | null;
}

export const updateUserProfile = async (
  userId: string | number,
  payload: UpdateUserProfilePayload,
  token?: string | null,
): Promise<UserDetailResponse> => {
  const res = await api.put(`/api/Users/${userId}/profile`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as UserDetailResponse;
};

export interface DeleteUserResponse {
  message?: string;
}

export const deleteUser = async (
  userId: string | number,
  token?: string | null,
): Promise<DeleteUserResponse> => {
  const res = await api.delete(`/api/Users/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as DeleteUserResponse;
};
