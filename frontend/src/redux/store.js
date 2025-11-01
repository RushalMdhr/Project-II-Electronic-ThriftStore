import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/users/userSlice";
import { vendorApi } from "./api/vendorApiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer, // vendor API slice
    auth: authReducer,
    users: userReducer,
    // No cart reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, vendorApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export default store;
