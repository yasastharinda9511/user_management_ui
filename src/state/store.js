import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import userRegistrationReducer from "./userRegistrationSlice.js";
import vehicleReducer from "./vehicleSlice.js";
import dashboardReducer from "./dashBoardSlice.js";

export const store = configureStore({
    reducer: {auth: authReducer,
    registerUser: userRegistrationReducer,
    vehicles: vehicleReducer,
    dashBoard: dashboardReducer,}
});