import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import userRegistrationReducer from "./userRegistrationSlice.js";

export const store = configureStore({
    reducer: {auth: authReducer,
    registerUser: userRegistrationReducer,}
});