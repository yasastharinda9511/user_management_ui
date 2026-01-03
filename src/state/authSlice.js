import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../api/axiosClient';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await authApi.post('/login', loginData);
            const data = response.data;

            // Store tokens in localStorage
            localStorage.setItem('access_token', data.auth.token);
            localStorage.setItem('user_info', JSON.stringify(data.auth.user));

            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            return rejectWithValue(message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.put(`/api/users/${userData.id}`, {
                first_name: userData.first_name,
                last_name: userData.last_name,
                phone: userData.phone,
                email: userData.email
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile';
            return rejectWithValue(message);
        }
    }
);

export const introspectUser = createAsyncThunk(
    'auth/introspectUser',
    async (accessToken, { rejectWithValue }) => {
        try {
            console.log("Introspect called !!!");
            const response = await authApi.get('/introspect', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to introspect token';
            return rejectWithValue(message);
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
        isInitializing: true,
        permissions:[],
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
            state.isInitializing = false;
            state.permissions = [];
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

                // Decode JWT to get permissions
                try {
                    const decoded = jwtDecode(token);
                    state.permissions = decoded.permissions || [];
                } catch (error) {
                    console.error('Failed to decode JWT:', error);
                    state.permissions = [];
                }
            } else {
                // No stored token, initialization complete
                state.isInitializing = false;
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
                state.isInitializing = false;
                state.isAuthenticated = true;
                state.user = action.payload.auth.user;
                state.accessToken = action.payload.auth.access_token;
                // Load permissions from user's role
                state.permissions = action.payload.auth.permissions || [];
                state.message = {
                    type: 'success',
                    text: `Welcome back, ${action.payload.auth.user.username || action.payload.auth.user.first_name}!`
                };

                localStorage.setItem('access_token', action.payload.auth.access_token);
                localStorage.setItem('refresh_token', action.payload.auth.refresh_token);
                localStorage.setItem('user_info', JSON.stringify(action.payload.auth.user));
            })
            // Login rejected
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isInitializing = false;
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

            .addCase(introspectUser.pending, (state) => {
                state.isLoading = true;
                state.message = { type: '', text: '' };
            })

            .addCase(introspectUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isInitializing = false;
                state.isAuthenticated = action.payload.active;

                // If token is active, update user info and permissions
                if (action.payload.active && action.payload.user) {
                    const decoded = jwtDecode(state.accessToken);
                    state.permissions = decoded.permissions || [];
                    localStorage.setItem('user_info', JSON.stringify(action.payload.user));
                } else {
                    // If token is not active, clear everything including localStorage
                    state.user = null;
                    state.accessToken = null;
                    state.refreshToken = null;
                    state.permissions = [];
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user_info');
                }
            })

            .addCase(introspectUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isInitializing = false;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                // Clear localStorage when token is invalid
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_info');
            });
    }
});

export const { clearMessage, logout, loadUserFromStorage } = authSlice.actions;

// Selectors
export const selectPermissions = (state) => state.auth.permissions;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;