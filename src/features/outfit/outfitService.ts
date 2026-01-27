import { api } from "../../api/client";

export interface OutfitItem {
  outfitId?: number;
  categoryId?: number;
  name?: string;
  type?: string;
  gender?: string;
  region?: string;
  isLimited?: boolean;
  status?: string;
  baseRentalPrice?: number;
  createdAt?: string;
  categoryName?: string | null;
  totalImages?: number;
  totalSizes?: number;
  availableSizes?: number;
  primaryImageUrl?: string | null;
  averageRating?: number | null;
  totalReviews?: number;
  description?: string | null;
}

export interface OutfitListResponse {
  success?: boolean;
  data?: OutfitItem[];
}

export interface OutfitDetailResponse {
  success?: boolean;
  data?: OutfitItem | null;
}

export interface OutfitImageItem {
  imageId?: number;
  outfitId?: number;
  imageUrl?: string;
  imageType?: string;
  sortOrder?: number;
}

export interface OutfitImageListResponse {
  success?: boolean;
  data?: OutfitImageItem[];
}

export const getOutfits = async (
  token?: string | null,
): Promise<OutfitListResponse> => {
  const res = await api.get("/api/Outfit", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as OutfitListResponse;
};

export const getOutfitById = async (
  outfitId: string | number,
  token?: string | null,
): Promise<OutfitDetailResponse> => {
  const res = await api.get(`/api/Outfit/${outfitId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as OutfitDetailResponse;
};

export const getOutfitImages = async (
  outfitId: string | number,
  token?: string | null,
): Promise<OutfitImageListResponse> => {
  const res = await api.get(`/api/OutfitImage/outfit/${outfitId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as OutfitImageListResponse;
};
