import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as service from "./authService";

export interface AuthState {
  currentUser: any | null;
  token?: string | null;
  loading: boolean;
  error?: string | null;
}

const initialState: AuthState = (() => {
  let currentUser: any = null;
  let token: string | null = null;

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw && raw !== "undefined") {
        currentUser = JSON.parse(raw);
      }
    } catch (e) {
      currentUser = null;
    }

    try {
      token = localStorage.getItem("authToken");
    } catch (e) {
      token = null;
    }
  }

  return {
    currentUser,
    token,
    loading: false,
    error: null,
  } as AuthState;
})();

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: service.LoginPayload, thunkAPI) => {
    try {
      const res = await service.login(payload);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data || err.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: service.RegisterPayload, thunkAPI) => {
    try {
      const res = await service.register(payload);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data || err.message);
    }
  },
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(loginUser.fulfilled, (s, a: PayloadAction<any>) => {
      s.loading = false;
      s.currentUser = a.payload.user;
      s.token = a.payload.token;
      try {
        localStorage.setItem("currentUser", JSON.stringify(a.payload.user));
        localStorage.setItem("authToken", a.payload.token);
      } catch (e) {
        // ignore
      }
    });
    builder.addCase(loginUser.rejected, (s, a) => {
      s.loading = false;
      s.error = typeof a.payload === "string" ? a.payload : a.error?.message;
    });

    builder.addCase(registerUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(registerUser.fulfilled, (s) => {
      s.loading = false;
      s.error = null;
    });
    builder.addCase(registerUser.rejected, (s, a) => {
      s.loading = false;
      s.error = typeof a.payload === "string" ? a.payload : a.error?.message;
    });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
