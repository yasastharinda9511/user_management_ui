import { authApi } from './axiosClient';

/**
 * User Service - Handles all user-related API calls
 */
const userService = {
    /**
     * Fetch all users
     * @returns {Promise} - User data with count
     */
    getAllUsers: async () => {
        const response = await authApi.get('/users');
        return response.data;
    },

    /**
     * Fetch user by ID
     * @param {number} userId - User ID
     * @returns {Promise} - User data
     */
    getUserById: async (userId) => {
        const response = await authApi.get(`/users/${userId}`);
        return response.data;
    },

    /**
     * Create new user
     * @param {Object} userData - User data
     * @returns {Promise} - Created user data
     */
    createUser: async (userData) => {
        const response = await authApi.post('/users', userData);
        return response.data;
    },

    /**
     * Update user
     * @param {number} userId - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise} - Updated user data
     */
    updateUser: async (userId, userData) => {
        const response = await authApi.put(`/users/${userId}`, userData);
        return response.data;
    },

    /**
     * Delete user
     * @param {number} userId - User ID
     * @returns {Promise} - Deletion confirmation
     */
    deleteUser: async (userId) => {
        const response = await authApi.delete(`/users/${userId}`);
        return response.data;
    },

    /**
     * Activate/Deactivate user
     * @param {number} userId - User ID
     * @param {boolean} isActive - Active status
     * @returns {Promise} - Updated user data
     */
    updateUserStatus: async (userId, isActive) => {
        const response = await authApi.patch(`/users/${userId}/status`, { is_active: isActive });
        return response.data;
    },

    /**
     * Toggle user active/inactive status
     * @param {number} userId - User ID
     * @returns {Promise} - Updated user data
     */
    toggleUserStatus: async (userId) => {
        const response = await authApi.put(`/users/${userId}/toggle`);
        return response.data;
    },
};

export default userService;
