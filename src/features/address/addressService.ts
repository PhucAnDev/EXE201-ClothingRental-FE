import { api } from "../../api/client";

export interface UserAddressItem {
  addressId?: number;
  userId?: number;
  label?: string;
  recipientName?: string;
  phoneNumber?: string;
  addressLine?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean | number | string;
}

export interface UserAddressListResponse {
  userIdFromToken?: number;
  count?: number;
  data?: UserAddressItem[];
}

export interface CreateUserAddressPayload {
  label: string;
  recipientName: string;
  phoneNumber: string;
  addressLine: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export const getUserAddresses = async (
  token?: string | null,
): Promise<UserAddressListResponse> => {
  const res = await api.get("/api/user-addresses", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as UserAddressListResponse;
};

export const createUserAddress = async (
  payload: CreateUserAddressPayload,
  token?: string | null,
): Promise<UserAddressItem> => {
  const res = await api.post("/api/user-addresses", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as UserAddressItem;
};

export const setUserAddressDefault = async (
  addressId: string | number,
  token?: string | null,
): Promise<UserAddressItem> => {
  const res = await api.patch(`/api/user-addresses/${addressId}/set-default`, null, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as UserAddressItem;
};
