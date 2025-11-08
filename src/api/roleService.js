import { authApi } from './axiosClient';

/**
 * Role Service - Handles all role-related API calls
 */
const roleService = {
    /**
     * Fetch all roles
     * @returns {Promise} - Role data with count
     */
    getAllRoles: async () => {
        const response = await authApi.get('/roles');
        return response.data;
    },

    /**
     * Fetch role by ID
     * @param {number} roleId - Role ID
     * @returns {Promise} - Role data
     */
    getRoleById: async (roleId) => {
        const response = await authApi.get(`/roles/${roleId}`);
        return response.data;
    },

    /**
     * Create new role
     * @param {Object} roleData - Role data {name, description, permissions}
     * @returns {Promise} - Created role data
     */
    createRole: async (roleData) => {
        const response = await authApi.post('/roles', roleData);
        return response.data;
    },

    /**
     * Update role
     * @param {number} roleId - Role ID
     * @param {Object} roleData - Updated role data
     * @returns {Promise} - Updated role data
     */
    updateRole: async (roleId, roleData) => {
        const response = await authApi.put(`/roles/${roleId}`, roleData);
        return response.data;
    },

    /**
     * Delete role
     * @param {number} roleId - Role ID
     * @returns {Promise} - Deletion confirmation
     */
    deleteRole: async (roleId) => {
        const response = await authApi.delete(`/roles/${roleId}`);
        return response.data;
    },

    /**
     * Fetch all available permissions
     * @returns {Promise} - Permissions data with count
     */
    getAllPermissions: async () => {
        const response = await authApi.get('/permissions');
        return response.data;
    },
};

export default roleService;
