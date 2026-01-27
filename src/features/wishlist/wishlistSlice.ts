import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOutfitById, getOutfitImages } from "../outfit/outfitService";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "./wishlistService";

export interface WishlistState {
  status: "idle" | "loading" | "succeeded" | "failed";
  addingId: number | null;
  message: string | null;
  error: string | null;
  removeStatus: "idle" | "loading" | "succeeded" | "failed";
  removingId: number | null;
  removeError: string | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  items: WishlistItem[];
}

const initialState: WishlistState = {
  status: "idle",
  addingId: null,
  message: null,
  error: null,
  removeStatus: "idle",
  removingId: null,
  removeError: null,
  listStatus: "idle",
  listError: null,
  items: [],
};

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  description: string;
  tag: string;
  image: string;
  rating: number;
  available: boolean;
}

const selectPrimaryImage = (images: { imageUrl?: string; sortOrder?: number }[]) => {
  if (!images.length) return "";
  const sorted = [...images].sort((a, b) => {
    const aOrder =
      typeof a.sortOrder === "number" ? a.sortOrder : Number.POSITIVE_INFINITY;
    const bOrder =
      typeof b.sortOrder === "number" ? b.sortOrder : Number.POSITIVE_INFINITY;
    return aOrder - bOrder;
  });
  return sorted[0]?.imageUrl || "";
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchList",
  async (_: void, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const wishlistRes = await getWishlist(token);
      const entries = Array.isArray(wishlistRes?.data) ? wishlistRes.data : [];

      const results = await Promise.allSettled(
        entries.map(async (entry) => {
          const outfitId = entry.outfitId;
          if (!outfitId) return null;
          const [outfitRes, imagesRes] = await Promise.all([
            getOutfitById(outfitId, token),
            getOutfitImages(outfitId, token),
          ]);
          const outfit = outfitRes?.data ?? null;
          const images = Array.isArray(imagesRes?.data) ? imagesRes.data : [];
          const primaryImage =
            selectPrimaryImage(images) || outfit?.primaryImageUrl || "";

          return {
            id: outfit?.outfitId ?? outfitId,
            name: outfit?.name || entry.outfitName || "Chưa có tên",
            price:
              typeof outfit?.baseRentalPrice === "number"
                ? outfit.baseRentalPrice
                : Number(outfit?.baseRentalPrice) ||
                  Number(entry.outfitPrice) ||
                  0,
            description: outfit?.description || "",
            tag: outfit?.isLimited ? "Cao cấp" : "",
            image: primaryImage || entry.outfitImageUrl || "",
            rating:
              typeof outfit?.averageRating === "number"
                ? outfit.averageRating
                : 0,
            available: outfit?.status
              ? String(outfit.status).toLowerCase() === "available"
              : true,
          } satisfies WishlistItem;
        }),
      );

      const items = results
        .map((result) =>
          result.status === "fulfilled" ? result.value : null,
        )
        .filter((item): item is WishlistItem => Boolean(item));

      return items;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Không thể tải wishlist.",
      );
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (outfitId: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await addWishlistItem(outfitId, token);
      thunkAPI.dispatch(fetchWishlist());
      return {
        outfitId,
        message:
          response?.message ??
          "Đã thêm outfit vào danh sách yêu thích của bạn.",
      };
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Outfit đã được thêm vào danh sách yêu thích.";
      return thunkAPI.rejectWithValue({ outfitId, message });
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (outfitId: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await removeWishlistItem(outfitId, token);
      return {
        outfitId,
        message:
          response?.message ??
          "Đã xóa outfit khỏi danh sách yêu thích.",
      };
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể xóa outfit khỏi danh sách yêu thích.";
      return thunkAPI.rejectWithValue({ outfitId, message });
    }
  },
);

const slice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistStatus(state) {
      state.status = "idle";
      state.message = null;
      state.error = null;
      state.addingId = null;
    },
    clearWishlistRemoveStatus(state) {
      state.removeStatus = "idle";
      state.removeError = null;
      state.removingId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToWishlist.pending, (state, action) => {
      state.status = "loading";
      state.message = null;
      state.error = null;
      state.addingId = Number(action.meta.arg) || null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.message = action.payload.message ?? null;
      state.error = null;
      state.addingId = null;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      const payload = action.payload as { message?: string } | undefined;
      state.status = "failed";
      state.message = null;
      state.error = payload?.message ?? action.error?.message ?? null;
      state.addingId = null;
    });
    builder.addCase(removeFromWishlist.pending, (state, action) => {
      state.removeStatus = "loading";
      state.removeError = null;
      state.removingId = Number(action.meta.arg) || null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.removeStatus = "succeeded";
      state.removeError = null;
      state.removingId = null;
      state.items = state.items.filter(
        (item) => item.id !== action.payload.outfitId,
      );
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      const payload = action.payload as { message?: string } | undefined;
      state.removeStatus = "failed";
      state.removeError = payload?.message ?? action.error?.message ?? null;
      state.removingId = null;
    });
    builder.addCase(fetchWishlist.pending, (state) => {
      state.listStatus = "loading";
      state.listError = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.items = action.payload;
      state.listError = null;
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      const payload = action.payload as string | undefined;
      state.listStatus = "failed";
      state.listError = payload ?? action.error?.message ?? null;
    });
  },
});

export const { clearWishlistStatus, clearWishlistRemoveStatus } = slice.actions;
export default slice.reducer;
