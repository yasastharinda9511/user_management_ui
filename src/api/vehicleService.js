import { carServiceApi } from './axiosClient';

/**
 * Vehicle Service - Handles all vehicle-related API calls
 */
const vehicleService = {
    /**
     * Fetch all vehicles with pagination and filters
     * @param {Object} params - Query parameters (page, limit, filters)
     * @returns {Promise} - Vehicle data with pagination
     */
    getAllVehicles: async ({ page = 1, limit = 10, filters = {} } = {}) => {
        const queryParams = { ...filters, page, limit };
        const response = await carServiceApi.get('/vehicles', { params: queryParams });
        return response.data;
    },

    /**
     * Fetch vehicle by ID
     * @param {number} vehicleId - Vehicle ID
     * @returns {Promise} - Vehicle data
     */
    getVehicleById: async (vehicleId) => {
        const response = await carServiceApi.get(`/vehicles/${vehicleId}`);
        return response.data;
    },

    /**
     * Create new vehicle
     * @param {Object} vehicleData - Vehicle data
     * @returns {Promise} - Created vehicle data
     */
    createVehicle: async (vehicleData) => {
        const response = await carServiceApi.post('/vehicles', vehicleData);
        return response.data;
    },

    /**
     * Update vehicle details
     * @param {number} vehicleId - Vehicle ID
     * @param {Object} updateData - Updated vehicle data
     * @returns {Promise} - Updated vehicle data
     */
    updateVehicle: async (vehicleId, updateData) => {
        const response = await carServiceApi.put(`/vehicles/${vehicleId}`, updateData);
        return response.data;
    },

    /**
     * Update vehicle purchase details
     * @param {number} vehicleId - Vehicle ID
     * @param {Object} purchaseData - Purchase data
     * @returns {Promise} - Updated purchase data
     */
    updateVehiclePurchase: async (vehicleId, purchaseData) => {
        const response = await carServiceApi.put(`/vehicles/${vehicleId}/purchase`, purchaseData);
        return response.data;
    },

    /**
     * Update vehicle shipping details
     * @param {number} vehicleId - Vehicle ID
     * @param {Object} shippingData - Shipping data
     * @returns {Promise} - Updated shipping data
     */
    updateVehicleShipping: async (vehicleId, shippingData) => {
        const response = await carServiceApi.put(`/vehicles/${vehicleId}/shipping`, shippingData);
        return response.data;
    },

    /**
     * Update vehicle financial details
     * @param {number} vehicleId - Vehicle ID
     * @param {Object} financialData - Financial data
     * @returns {Promise} - Updated financial data
     */
    updateVehicleFinancials: async (vehicleId, financialData) => {
        const response = await carServiceApi.put(`/vehicles/${vehicleId}/financials`, financialData);
        return response.data;
    },

    /**
     * Update vehicle sales details
     * @param {number} vehicleId - Vehicle ID
     * @param {Object} salesData - Sales data
     * @returns {Promise} - Updated sales data
     */
    updateVehicleSales: async (vehicleId, salesData) => {
        const response = await carServiceApi.put(`/vehicles/${vehicleId}/sales`, salesData);
        return response.data;
    },

    /**
     * Create vehicle with images
     * @param {Object} vehicleData - Vehicle data
     * @param {Array} images - Array of images
     * @returns {Promise} - Created vehicle data
     */
    createVehicleWithImages: async (vehicleData, images) => {
        // Create vehicle first
        const vehicleResponse = await carServiceApi.post('/vehicles', vehicleData);
        const vehicle = vehicleResponse.data;

        // Upload images if any
        if (images && images.length > 0) {
            const formData = new FormData();
            images.forEach(image => formData.append('images', image.file));

            // The Authorization header will be added automatically by the interceptor
            await carServiceApi.post(`/vehicles/upload-image/${vehicle.data.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        return vehicle;
    },

    /**
     * Fetch dropdown options for filters
     * @returns {Promise} - Filter options
     */
    getDropdownOptions: async () => {
        const response = await carServiceApi.get('/vehicles/dropdown/options');
        return response.data;
    },

    getVehicleImagePresignedUrl: async (filename) => {
        const response = await carServiceApi.get(`/vehicles/download-image/${filename}`);
        return response.data;
    },

    /**
     * Upload images for existing vehicle
     * @param {number} vehicleId - Vehicle ID
     * @param {Array} images - Array of image files
     * @returns {Promise} - Upload response
     */
    uploadVehicleImages: async (vehicleId, images) => {
        const formData = new FormData();
        images.forEach(image => formData.append('images', image));

        const response = await carServiceApi.post(`/vehicles/upload-image/${vehicleId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Get all vehicle makes with their models
     * @returns {Promise} - List of makes with models
     */
    getMakes: async () => {
        const response = await carServiceApi.get('/makes');
        return response.data;
    },

    /**
     * Get models for a specific make
     * @param {number} makeId - Make ID
     * @returns {Promise} - List of models for the make
     */
    getModels: async (makeId) => {
        const response = await carServiceApi.get(`/models?make_id=${makeId}`);
        return response.data;
    },

    /**
     * Create a new vehicle make
     * @param {string} makeName - Name of the make
     * @returns {Promise} - Created make data
     */
    createMake: async (makeName) => {
        const response = await carServiceApi.post('/makes', { make_name: makeName });
        return response.data;
    },

    /**
     * Create a new vehicle model
     * @param {Object} modelData - Model data including make_id, model_name, body_type, fuel_type, transmission_type, engine_size_cc
     * @returns {Promise} - Created model data
     */
    createModel: async (modelData) => {
        const response = await carServiceApi.post('/models', modelData);
        return response.data;
    }
};

export default vehicleService;
