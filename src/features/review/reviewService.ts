import { api } from "../../api/client";

export interface ReviewImageItem {
  imgId?: number;
  reviewId?: number;
  imageUrl?: string;
}

export interface ReviewItem {
  reviewId?: number;
  outfitId?: number;
  userId?: number;
  userFullName?: string;
  userEmail?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  images?: ReviewImageItem[];
}

export interface ReviewListResponse {
  success?: boolean;
  data?: ReviewItem[];
  count?: number;
}

export interface ReviewCreatePayload {
  outfitId: number;
  userId: number;
  rating: number;
  comment: string;
  imageUrls?: string[];
}

export interface ReviewCreateResponse {
  success?: boolean;
  data?: ReviewItem | null;
  message?: string;
}

export const getReviewsByOutfitId = async (
  outfitId: string | number,
  token?: string | null,
): Promise<ReviewListResponse> => {
  const res = await api.get(`/api/Review/outfit/${outfitId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as ReviewListResponse;
};

export const createReview = async (
  payload: ReviewCreatePayload,
  token?: string | null,
): Promise<ReviewCreateResponse> => {
  const res = await api.post("/api/Review", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data as ReviewCreateResponse;
};
