import { api } from "../../api/client";

export interface WishlistAddResponse {
  success?: boolean;
  message?: string;
}

export interface WishlistEntry {
  wishlistId?: number;
  userId?: number;
  outfitId?: number;
  addedAt?: string;
  outfitName?: string | null;
  outfitPrice?: number | null;
  outfitImageUrl?: string | null;
}

export interface WishlistListResponse {
  success?: boolean;
  data?: WishlistEntry[];
  count?: number;
}

export const getWishlist = async (
  token?: string | null,
): Promise<WishlistListResponse> => {
  const res = await api.get("/api/Wishlist", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as WishlistListResponse;
};

export const addWishlistItem = async (
  outfitId: number,
  token?: string | null,
): Promise<WishlistAddResponse> => {
  const res = await api.post(
    "/api/Wishlist",
    { outfitId },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );
  return res.data as WishlistAddResponse;
};

export const removeWishlistItem = async (
  outfitId: number,
  token?: string | null,
): Promise<WishlistAddResponse> => {
  const res = await api.delete(`/api/Wishlist/outfit/${outfitId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as WishlistAddResponse;
};
