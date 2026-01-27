// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import outfitReducer from "../features/outfit/outfitSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    outfit: outfitReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// To use store in your app, wrap the root with <Provider store={store}> in src/main.tsx
