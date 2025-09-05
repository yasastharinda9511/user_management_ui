import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for user registration
export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue({
                message: error.message || 'Registration failed',
            });
        }
    }
);

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isRegistered: false,
};

const userRegistrationSlice = createSlice({
    name: 'userRegistration',
    initialState,
    reducers: {
        // Reset registration state
        resetRegistration: (state) => {
            state.user = null;
            state.error = null;
            state.isRegistered = false;
            state.isLoading = false;
        },
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.isRegistered = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isRegistered = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isRegistered = false;
            });
    },
});

export const { resetRegistration, clearError } = userRegistrationSlice.actions;
export default userRegistrationSlice.reducer;

// Selectors
// export const selectUser = (state) => state.userRegistration.user;
// export const selectIsLoading = (state) => state.userRegistration.isLoading;
// export const selectError = (state) => state.userRegistration.error;
// export const selectIsRegistered = (state) => state.userRegistration.isRegistered;