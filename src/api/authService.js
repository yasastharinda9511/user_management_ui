import { authApi } from './axiosClient';

/**
 * Auth Service - Handles all authentication-related API calls
 */
const authService = {
    /**
     * User login
     * @param {Object} credentials - {email, password}
     * @returns {Promise} - Authentication tokens and user data
     */
    login: async (credentials) => {
        const response = await authApi.post('/login', credentials);
        return response.data;
    },

    /**
     * User registration
     * @param {Object} userData - User registration data
     * @returns {Promise} - Created user data
     */
    register: async (userData) => {
        const response = await authApi.post('/register', userData);
        return response.data;
    },

    /**
     * User logout
     * @returns {Promise} - Logout confirmation
     */
    logout: async () => {
        const response = await authApi.post('/logout');
        return response.data;
    },

    /**
     * Refresh access token
     * @param {string} refreshToken - Refresh token
     * @returns {Promise} - New access token
     */
    refreshToken: async (refreshToken) => {
        const response = await authApi.post('/refresh', { refresh_token: refreshToken });
        return response.data;
    },

    /**
     * Introspect/verify token
     * @param {string} token - Access token
     * @returns {Promise} - Token validation result
     */
    introspect: async (token) => {
        const response = await authApi.post('/introspect', { token });
        return response.data;
    },

    /**
     * Request password reset
     * @param {string} email - User email
     * @returns {Promise} - Reset request confirmation
     */
    requestPasswordReset: async (email) => {
        const response = await authApi.post('/password-reset/request', { email });
        return response.data;
    },

    /**
     * Reset password with token
     * @param {Object} data - {token, new_password}
     * @returns {Promise} - Password reset confirmation
     */
    resetPassword: async (data) => {
        const response = await authApi.post('/password-reset/confirm', data);
        return response.data;
    },

    /**
     * Verify email
     * @param {string} token - Email verification token
     * @returns {Promise} - Verification confirmation
     */
    verifyEmail: async (token) => {
        const response = await authApi.post('/verify-email', { token });
        return response.data;
    },

    /**
     * Change password
     * @param {Object} data - {old_password, new_password}
     * @returns {Promise} - Password change confirmation
     */
    changePassword: async (data) => {
        const response = await authApi.post('/change-password', data);
        return response.data;
    },
};

export default authService;
