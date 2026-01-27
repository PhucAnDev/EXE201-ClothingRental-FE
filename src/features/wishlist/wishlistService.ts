import { api } from "../../api/client";

export interface WishlistAddResponse {
  success?: boolean;
  message?: string;
}

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
