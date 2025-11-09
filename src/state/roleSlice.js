import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roleService from '../api/roleService';
import permissionService from '../api/permissionService';

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
            const data = await permissionService.getAllPermissions();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch permission by ID
export const fetchPermissionById = createAsyncThunk(
    'roles/fetchPermissionById',
    async (permissionId, { rejectWithValue }) => {
        try {
            const data = await permissionService.getPermissionById(permissionId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create new permission
export const createPermission = createAsyncThunk(
    'roles/createPermission',
    async (permissionData, { rejectWithValue }) => {
        try {
            const data = await permissionService.createPermission(permissionData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update permission
export const updatePermission = createAsyncThunk(
    'roles/updatePermission',
    async ({ permissionId, permissionData }, { rejectWithValue }) => {
        try {
            const data = await permissionService.updatePermission(permissionId, permissionData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete permission
export const deletePermission = createAsyncThunk(
    'roles/deletePermission',
    async (permissionId, { rejectWithValue }) => {
        try {
            const data = await permissionService.deletePermission(permissionId);
            return { permissionId, ...data };
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
    selectedPermission: null,
    totalCount: 0,
    permissionsCount: 0,
    loading: false,
    loadingRole: false,
    loadingPermissions: false,
    loadingPermission: false,
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
        clearSelectedPermission: (state) => {
            state.selectedPermission = null;
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
                state.permissionsCount = action.payload.count || 0;
            })
            .addCase(fetchAllPermissions.rejected, (state, action) => {
                state.loadingPermissions = false;
                state.error = action.payload;
            })

            // Fetch Permission by ID
            .addCase(fetchPermissionById.pending, (state) => {
                state.loadingPermission = true;
                state.error = null;
            })
            .addCase(fetchPermissionById.fulfilled, (state, action) => {
                state.loadingPermission = false;
                state.selectedPermission = action.payload;
            })
            .addCase(fetchPermissionById.rejected, (state, action) => {
                state.loadingPermission = false;
                state.error = action.payload;
                state.selectedPermission = null;
            })

            // Create Permission
            .addCase(createPermission.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(createPermission.fulfilled, (state, action) => {
                state.updating = false;
                state.allPermissions.unshift(action.payload);
                state.permissionsCount += 1;
            })
            .addCase(createPermission.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Update Permission
            .addCase(updatePermission.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updatePermission.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.allPermissions.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.allPermissions[index] = action.payload;
                }
                if (state.selectedPermission && state.selectedPermission.id === action.payload.id) {
                    state.selectedPermission = action.payload;
                }
            })
            .addCase(updatePermission.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Delete Permission
            .addCase(deletePermission.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(deletePermission.fulfilled, (state, action) => {
                state.updating = false;
                state.allPermissions = state.allPermissions.filter(p => p.id !== action.payload.permissionId);
                state.permissionsCount -= 1;
                if (state.selectedPermission && state.selectedPermission.id === action.payload.permissionId) {
                    state.selectedPermission = null;
                }
            })
            .addCase(deletePermission.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            });
    },
});

// Actions
export const { clearError, clearSelectedRole, clearSelectedPermission } = roleSlice.actions;

// Selectors
export const selectRoles = (state) => state.roles.roles;
export const selectSelectedRole = (state) => state.roles.selectedRole;
export const selectAllPermissions = (state) => state.roles.allPermissions;
export const selectSelectedPermission = (state) => state.roles.selectedPermission;
export const selectTotalCount = (state) => state.roles.totalCount;
export const selectPermissionsCount = (state) => state.roles.permissionsCount;
export const selectLoading = (state) => state.roles.loading;
export const selectLoadingRole = (state) => state.roles.loadingRole;
export const selectLoadingPermissions = (state) => state.roles.loadingPermissions;
export const selectLoadingPermission = (state) => state.roles.loadingPermission;
export const selectUpdating = (state) => state.roles.updating;
export const selectError = (state) => state.roles.error;
export const selectUpdateError = (state) => state.roles.updateError;

export default roleSlice.reducer;
