import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080/api';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Login failed. Please check your credentials.');
            }

            // Store tokens in localStorage
            localStorage.setItem('access_token', data.auth.access_token);
            localStorage.setItem('refresh_token', data.auth.refresh_token);
            localStorage.setItem('user_info', JSON.stringify(data.auth.user));

            return data;
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return rejectWithValue('Network error. Please try again.');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData, { rejectWithValue }) => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/users/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    phone: userData.phone,
                    email: userData.email
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const data = await response.json();
            return data; // Should return updated user data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
        message: {
            type: '',
            text: ''
        }
    },
    reducers: {
        clearMessage: (state) => {
            state.message = { type: '', text: '' };
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_info');
        },
        loadUserFromStorage: (state) => {
            const token = localStorage.getItem('access_token');
            const userInfo = localStorage.getItem('user_info');

            if (token && userInfo) {
                state.accessToken = token;
                state.refreshToken = localStorage.getItem('refresh_token');
                state.user = JSON.parse(userInfo);
                state.isAuthenticated = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login pending
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = { type: '', text: '' };
            })
            // Login fulfilled
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.auth.user;
                state.accessToken = action.payload.auth.token;
                state.message = {
                    type: 'success',
                    text: `Welcome back, ${action.payload.auth.user.username || action.payload.auth.user.first_name}!`
                };
            })
            // Login rejected
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.message = {
                    type: 'error',
                    text: action.payload
                };
            })

            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.message = { type: '', text: '' };
            })

            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.message = {
                    type: 'error',
                    text: action.payload
                }
            })

            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.auth.user;
                state.accessToken = action.payload.auth.token;
                state.message = {
                    type: 'success',
                    text: `Your Profile Details are Updated, ${action.payload.auth.user.username}!`
                }
            })
        ;


    }
});

export const { clearMessage, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;