import { allTabs } from '../components/tabs/tabs.js';

/**
 * Check if user has a specific permission
 * @param {Array} permissions - User's permissions array from JWT
 * @param {string} permissionName - Permission to check (e.g., "analytics.access")
 * @returns {boolean}
 */
export const hasPermission = (permissions, permissionName) => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.some(p => p === permissionName);
};

/**
 * Get all tabs that user has access to based on permissions
 * @param {Array} permissions - User's permissions array from JWT
 * @returns {Array} - Filtered tabs array
 */
export const getAccessibleTabs = (permissions) => {
    return allTabs.filter(tab => {
        if (tab.requiredPermission) {
            return hasPermission(permissions, tab.requiredPermission);
        }
        return true; // Show tabs without permission requirements
    });
};

/**
 * Get the first accessible path for user based on permissions
 * Used for default redirect after login
 * @param {Array} permissions - User's permissions array from JWT
 * @returns {string} - First accessible path (defaults to '/dashboard')
 */
export const getFirstAccessiblePath = (permissions) => {
    const accessibleTabs = getAccessibleTabs(permissions);

    if (accessibleTabs.length > 0) {
        return accessibleTabs[0].path;
    }

    // Fallback to dashboard if no tabs are accessible
    return '/dashboard';
};
