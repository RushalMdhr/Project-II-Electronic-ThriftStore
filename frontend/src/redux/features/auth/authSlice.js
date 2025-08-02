import { createSlice } from "@reduxjs/toolkit";

// Load user and role from localStorage
const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

let defaultRole = null;
if (userInfo) {
  if (userInfo.isAdmin) {
    defaultRole = null; // Admin should not have buyer/seller role
  } else {
    defaultRole = localStorage.getItem("role") || "buyer"; // Default to buyer
  }
}

const initialState = {
  userInfo,
  role: defaultRole,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      // Handle role
      if (action.payload.isAdmin) {
        state.role = null;
        localStorage.removeItem("role");
      } else {
        state.role = "buyer";
        localStorage.setItem("role", "buyer");
      }

      const expirationDate = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationDate", expirationDate);
    },

    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },

    logout: (state) => {
      state.userInfo = null;
      state.role = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("role");
      localStorage.removeItem("expirationDate");
    },
  },
});

export const { setCredentials, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
