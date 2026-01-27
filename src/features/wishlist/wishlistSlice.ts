import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addWishlistItem } from "./wishlistService";

export interface WishlistState {
  status: "idle" | "loading" | "succeeded" | "failed";
  addingId: number | null;
  message: string | null;
  error: string | null;
}

const initialState: WishlistState = {
  status: "idle",
  addingId: null,
  message: null,
  error: null,
};

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (outfitId: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await addWishlistItem(outfitId, token);
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
  },
});

export const { clearWishlistStatus } = slice.actions;
export default slice.reducer;
