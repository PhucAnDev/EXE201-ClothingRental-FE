import { api } from "../../api/client";

export interface ServicePackageItem {
  servicePkgId?: number;
  studioId?: number;
  studioName?: string;
  name?: string;
  description?: string;
  basePrice?: number;
  totalAddons?: number;
  totalBookings?: number;
}

export interface ServicePackageListResponse {
  success?: boolean;
  data?: ServicePackageItem[];
}

export const getServicePackages = async (
  token?: string | null,
): Promise<ServicePackageListResponse> => {
  const res = await api.get("/api/ServicePackage", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as ServicePackageListResponse;
};
