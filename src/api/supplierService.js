import { carServiceApi } from './axiosClient';

/**
 * Supplier Service - Handles all supplier-related API calls
 */
const supplierService = {
    /**
     * Fetch all suppliers with pagination
     * @param {Object} params - Query parameters (page, limit, search)
     * @returns {Promise} - Supplier data with pagination
     */
    getAllSuppliers: async ({ page = 1, limit = 10, search = '' } = {}) => {
        const queryParams = { page, limit };
        if (search) queryParams.q = search;
        const response = await carServiceApi.get('/suppliers', { params: queryParams });
        return response.data;
    },

    /**
     * Fetch supplier by ID
     * @param {number} supplierId - Supplier ID
     * @returns {Promise} - Supplier data
     */
    getSupplierById: async (supplierId) => {
        const response = await carServiceApi.get(`/suppliers/${supplierId}`);
        return response.data;
    },

    /**
     * Create new supplier
     * @param {Object} supplierData - Supplier data
     * @returns {Promise} - Created supplier data
     */
    createSupplier: async (supplierData) => {
        const response = await carServiceApi.post('/suppliers', supplierData);
        return response.data;
    },

    /**
     * Update supplier
     * @param {number} supplierId - Supplier ID
     * @param {Object} supplierData - Updated supplier data
     * @returns {Promise} - Updated supplier data
     */
    updateSupplier: async (supplierId, supplierData) => {
        const response = await carServiceApi.put(`/suppliers/${supplierId}`, supplierData);
        return response.data;
    },

    /**
     * Delete supplier (soft delete)
     * @param {number} supplierId - Supplier ID
     * @returns {Promise} - Delete response
     */
    deleteSupplier: async (supplierId) => {
        const response = await carServiceApi.delete(`/suppliers/${supplierId}`);
        return response.data;
    },

    /**
     * Search suppliers
     * @param {string} query - Search query
     * @returns {Promise} - Search results
     */
    searchSuppliers: async (query) => {
        const response = await carServiceApi.get('/suppliers/search', { params: { q: query } });
        return response.data;
    }
};

export default supplierService;
