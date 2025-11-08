import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userService from '../api/userService';

// Fetch all users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.getAllUsers();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await userService.getUserById(userId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create new user
export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await userService.createUser(userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update user
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const data = await userService.updateUser(userId, userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete user
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await userService.deleteUser(userId);
            return { userId, ...data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update user status
export const updateUserStatus = createAsyncThunk(
    'users/updateUserStatus',
    async ({ userId, isActive }, { rejectWithValue }) => {
        try {
            const data = await userService.updateUserStatus(userId, isActive);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Toggle user status
export const toggleUserStatus = createAsyncThunk(
    'users/toggleUserStatus',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await userService.toggleUserStatus(userId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Initial state
const initialState = {
    users: [],
    selectedUser: null,
    totalCount: 0,
    loading: false,
    loadingUser: false,
    updating: false,
    error: null,
    updateError: null,
};

// User slice
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.updateError = null;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users || [];
                state.totalCount = action.payload.count || 0;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.users = [];
                state.totalCount = 0;
            })

            // Fetch User by ID
            .addCase(fetchUserById.pending, (state) => {
                state.loadingUser = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loadingUser = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loadingUser = false;
                state.error = action.payload;
                state.selectedUser = null;
            })

            // Create User
            .addCase(createUser.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.updating = false;
                state.users.unshift(action.payload);
                state.totalCount += 1;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Update User
            .addCase(updateUser.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser && state.selectedUser.id === action.payload.id) {
                    state.selectedUser = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.updating = false;
                state.users = state.users.filter(u => u.id !== action.payload.userId);
                state.totalCount -= 1;
                if (state.selectedUser && state.selectedUser.id === action.payload.userId) {
                    state.selectedUser = null;
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Update User Status
            .addCase(updateUserStatus.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Toggle User Status
            .addCase(toggleUserStatus.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                state.updating = false;
            })
            .addCase(toggleUserStatus.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            });
    },
});

// Actions
export const { clearError, clearSelectedUser } = userSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectTotalCount = (state) => state.users.totalCount;
export const selectLoading = (state) => state.users.loading;
export const selectLoadingUser = (state) => state.users.loadingUser;
export const selectUpdating = (state) => state.users.updating;
export const selectError = (state) => state.users.error;
export const selectUpdateError = (state) => state.users.updateError;

// Stats selectors
export const selectActiveUsersCount = (state) =>
    state.users.users.filter(u => u.is_active).length;

export const selectVerifiedUsersCount = (state) =>
    state.users.users.filter(u => u.is_email_verified).length;

export default userSlice.reducer;
