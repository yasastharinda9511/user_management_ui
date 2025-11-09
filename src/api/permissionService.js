import { authApi } from './axiosClient';

/**
 * Permission Service - Handles all permission-related API calls
 */
const permissionService = {
    /**
     * Fetch all permissions
     * @returns {Promise} - Permission data with count
     */
    getAllPermissions: async () => {
        const response = await authApi.get('/permissions');
        return response.data;
    },

    /**
     * Fetch permission by ID
     * @param {number} permissionId - Permission ID
     * @returns {Promise} - Permission data
     */
    getPermissionById: async (permissionId) => {
        const response = await authApi.get(`/permissions/${permissionId}`);
        return response.data;
    },

    /**
     * Create new permission
     * @param {Object} permissionData - Permission data {name, action, resource, description}
     * @returns {Promise} - Created permission data
     */
    createPermission: async (permissionData) => {
        const response = await authApi.post('/permissions', permissionData);
        return response.data;
    },

    /**
     * Update permission
     * @param {number} permissionId - Permission ID
     * @param {Object} permissionData - Updated permission data {name, action, resource, description}
     * @returns {Promise} - Updated permission data
     */
    updatePermission: async (permissionId, permissionData) => {
        const response = await authApi.put(`/permissions/${permissionId}`, permissionData);
        return response.data;
    },

    /**
     * Delete permission
     * @param {number} permissionId - Permission ID
     * @returns {Promise} - Deletion confirmation
     */
    deletePermission: async (permissionId) => {
        const response = await authApi.delete(`/permissions/${permissionId}`);
        return response.data;
    },
};

export default permissionService;
