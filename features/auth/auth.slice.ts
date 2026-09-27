import { createSlice } from "@reduxjs/toolkit";
import { User } from "./auth.interface";
import authApi from "./auth.api";
import { RootState } from "@/store";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.user = action.payload.data.user;
        }
      },
    );
  },
});

export const selectUser = (state: RootState) => state.authSlice.user;

export default authSlice;
