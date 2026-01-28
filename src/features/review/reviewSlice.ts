import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createReview,
  getReviewsByOutfitId,
  type ReviewCreatePayload,
  type ReviewItem,
} from "./reviewService";

export interface ReviewState {
  items: ReviewItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  count: number;
  currentOutfitId: string | number | null;
  addStatus: "idle" | "loading" | "succeeded" | "failed";
  addError: string | null;
}

const initialState: ReviewState = {
  items: [],
  status: "idle",
  error: null,
  count: 0,
  currentOutfitId: null,
  addStatus: "idle",
  addError: null,
};

const unwrapData = (payload: any) =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as { data?: ReviewItem[] }).data
    : payload;

export const fetchReviewsByOutfitId = createAsyncThunk(
  "review/fetchByOutfitId",
  async (outfitId: string | number, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await getReviewsByOutfitId(outfitId, token);
      const items = unwrapData(res);
      const list = Array.isArray(items) ? items : [];
      const count = typeof res?.count === "number" ? res.count : list.length;

      return {
        outfitId,
        items: list,
        count,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải đánh giá.",
      );
    }
  },
);

export const addReview = createAsyncThunk(
  "review/add",
  async (payload: ReviewCreatePayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await createReview(payload, token);
      return {
        outfitId: payload.outfitId,
        review: res?.data ?? null,
        message: res?.message,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể gửi đánh giá.",
      );
    }
  },
);

const slice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviews(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.count = 0;
      state.currentOutfitId = null;
    },
    clearAddReviewStatus(state) {
      state.addStatus = "idle";
      state.addError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReviewsByOutfitId.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
      state.items = [];
      state.count = 0;
      state.currentOutfitId = action.meta.arg;
    });
    builder.addCase(fetchReviewsByOutfitId.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.items = action.payload.items;
      state.count = action.payload.count;
      state.currentOutfitId = action.payload.outfitId;
    });
    builder.addCase(fetchReviewsByOutfitId.rejected, (state, action) => {
      state.status = "failed";
      state.error =
        typeof action.payload === "string"
          ? action.payload
          : action.error?.message || null;
    });
    builder.addCase(addReview.pending, (state) => {
      state.addStatus = "loading";
      state.addError = null;
    });
    builder.addCase(addReview.fulfilled, (state, action) => {
      state.addStatus = "succeeded";
      state.addError = null;
      const review = action.payload.review;
      if (review) {
        const shouldInsert =
          state.currentOutfitId === null ||
          String(state.currentOutfitId) === String(review.outfitId);
        if (shouldInsert) {
          state.items = [review, ...state.items];
          state.count += 1;
        }
      }
    });
    builder.addCase(addReview.rejected, (state, action) => {
      state.addStatus = "failed";
      state.addError =
        typeof action.payload === "string"
          ? action.payload
          : action.error?.message || null;
    });
  },
});

export const { clearReviews, clearAddReviewStatus } = slice.actions;
export default slice.reducer;
