import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getOutfitAttributesByOutfitId,
  getOutfitById,
  getOutfitImages,
  getOutfitSizes,
  type OutfitAttributesItem,
  type OutfitImageItem,
  type OutfitItem,
  type OutfitSizeItem,
} from "./outfitService";

export interface OutfitState {
  outfit: OutfitItem | null;
  images: OutfitImageItem[];
  sizes: OutfitSizeItem[];
  attributes: OutfitAttributesItem | null;
  loading: boolean;
  error?: string | null;
  currentOutfitId?: string | number | null;
}

const initialState: OutfitState = {
  outfit: null,
  images: [],
  sizes: [],
  attributes: null,
  loading: false,
  error: null,
  currentOutfitId: null,
};

const unwrapData = (payload: any) =>
  payload && typeof payload === "object" && "data" in payload
    ? payload.data
    : payload;

export const fetchOutfitDetail = createAsyncThunk(
  "outfit/fetchDetail",
  async (outfitId: string | number, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const [outfitRes, imagesRes, sizesRes, attributesRes] = await Promise.all(
        [
          getOutfitById(outfitId, token),
          getOutfitImages(outfitId, token),
          getOutfitSizes(outfitId, token),
          getOutfitAttributesByOutfitId(outfitId, token),
        ],
      );

      const outfit = unwrapData(outfitRes) || null;
      const imagesData = unwrapData(imagesRes);
      const sizesData = unwrapData(sizesRes);
      const attributes = unwrapData(attributesRes) || null;

      return {
        outfitId,
        outfit,
        images: Array.isArray(imagesData) ? imagesData : [],
        sizes: Array.isArray(sizesData) ? sizesData : [],
        attributes,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data || err?.message);
    }
  },
);

const slice = createSlice({
  name: "outfit",
  initialState,
  reducers: {
    clearOutfit(state) {
      state.outfit = null;
      state.images = [];
      state.sizes = [];
      state.attributes = null;
      state.loading = false;
      state.error = null;
      state.currentOutfitId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOutfitDetail.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      state.outfit = null;
      state.images = [];
      state.sizes = [];
      state.attributes = null;
      state.currentOutfitId = action.meta.arg;
    });
    builder.addCase(fetchOutfitDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.outfit = action.payload.outfit;
      state.images = action.payload.images;
      state.sizes = action.payload.sizes;
      state.attributes = action.payload.attributes;
      state.currentOutfitId = action.payload.outfitId;
    });
    builder.addCase(fetchOutfitDetail.rejected, (state, action) => {
      state.loading = false;
      state.error =
        typeof action.payload === "string"
          ? action.payload
          : action.error?.message;
    });
  },
});

export const { clearOutfit } = slice.actions;
export default slice.reducer;
