import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/api";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      if (!response.data?.token || !response.data?.user) {
        throw new Error("Invalid login response");
      }

      // ✅ SAVE TO LOCALSTORAGE (CRITICAL)
localStorage.setItem("user", JSON.stringify(response.data.user));
localStorage.setItem("token", response.data.token);

      return {

        user: response.data.user,
        token: response.data.token,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    dispatch({ type: "auth/forceLogout" });
    return true;
  }
);
