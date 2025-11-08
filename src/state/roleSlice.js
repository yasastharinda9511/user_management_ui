import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roleService from '../api/roleService';

// Fetch all roles
export const fetchRoles = createAsyncThunk(
    'roles/fetchRoles',
    async (_, { rejectWithValue }) => {
        try {
            const data = await roleService.getAllRoles();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch role by ID
export const fetchRoleById = createAsyncThunk(
    'roles/fetchRoleById',
    async (roleId, { rejectWithValue }) => {
        try {
            const data = await roleService.getRoleById(roleId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create new role
export const createRole = createAsyncThunk(
    'roles/createRole',
    async (roleData, { rejectWithValue }) => {
        try {
            const data = await roleService.createRole(roleData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update role
export const updateRole = createAsyncThunk(
    'roles/updateRole',
    async ({ roleId, roleData }, { rejectWithValue }) => {
        try {
            const data = await roleService.updateRole(roleId, roleData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete role
export const deleteRole = createAsyncThunk(
    'roles/deleteRole',
    async (roleId, { rejectWithValue }) => {
        try {
            const data = await roleService.deleteRole(roleId);
            return { roleId, ...data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch all permissions
export const fetchAllPermissions = createAsyncThunk(
    'roles/fetchAllPermissions',
    async (_, { rejectWithValue }) => {
        try {
            const data = await roleService.getAllPermissions();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Initial state
const initialState = {
    roles: [],
    selectedRole: null,
    allPermissions: [],
    totalCount: 0,
    loading: false,
    loadingRole: false,
    loadingPermissions: false,
    updating: false,
    error: null,
    updateError: null,
};

// Role slice
const roleSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.updateError = null;
        },
        clearSelectedRole: (state) => {
            state.selectedRole = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Roles
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.roles || [];
                state.totalCount = action.payload.count || 0;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.roles = [];
                state.totalCount = 0;
            })

            // Fetch Role by ID
            .addCase(fetchRoleById.pending, (state) => {
                state.loadingRole = true;
                state.error = null;
            })
            .addCase(fetchRoleById.fulfilled, (state, action) => {
                state.loadingRole = false;
                state.selectedRole = action.payload;
            })
            .addCase(fetchRoleById.rejected, (state, action) => {
                state.loadingRole = false;
                state.error = action.payload;
                state.selectedRole = null;
            })

            // Create Role
            .addCase(createRole.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.updating = false;
                state.roles.unshift(action.payload);
                state.totalCount += 1;
            })
            .addCase(createRole.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Update Role
            .addCase(updateRole.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.roles.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
                if (state.selectedRole && state.selectedRole.id === action.payload.id) {
                    state.selectedRole = action.payload;
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Delete Role
            .addCase(deleteRole.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.updating = false;
                state.roles = state.roles.filter(r => r.id !== action.payload.roleId);
                state.totalCount -= 1;
                if (state.selectedRole && state.selectedRole.id === action.payload.roleId) {
                    state.selectedRole = null;
                }
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Fetch All Permissions
            .addCase(fetchAllPermissions.pending, (state) => {
                state.loadingPermissions = true;
                state.error = null;
            })
            .addCase(fetchAllPermissions.fulfilled, (state, action) => {
                state.loadingPermissions = false;
                state.allPermissions = action.payload.permissions || [];
            })
            .addCase(fetchAllPermissions.rejected, (state, action) => {
                state.loadingPermissions = false;
                state.error = action.payload;
            });
    },
});

// Actions
export const { clearError, clearSelectedRole } = roleSlice.actions;

// Selectors
export const selectRoles = (state) => state.roles.roles;
export const selectSelectedRole = (state) => state.roles.selectedRole;
export const selectAllPermissions = (state) => state.roles.allPermissions;
export const selectTotalCount = (state) => state.roles.totalCount;
export const selectLoading = (state) => state.roles.loading;
export const selectLoadingRole = (state) => state.roles.loadingRole;
export const selectLoadingPermissions = (state) => state.roles.loadingPermissions;
export const selectUpdating = (state) => state.roles.updating;
export const selectError = (state) => state.roles.error;
export const selectUpdateError = (state) => state.roles.updateError;

export default roleSlice.reducer;
