import { carServiceApi } from './axiosClient';

const customerService = {
    // Get all customers - Using POST as specified by the user
    getAllCustomers: async () => {
        const response = await carServiceApi.get('/customers');
        return response.data;
    },

    // Get customer by ID
    getCustomerById: async (customerId) => {
        const response = await carServiceApi.get(`/customers/${customerId}`);
        return response.data;
    },

    // Create new customer
    createCustomer: async (customerData) => {
        const response = await carServiceApi.post('/customers', customerData);
        return response.data;
    },

    // Update existing customer
    updateCustomer: async (customerId, customerData) => {
        const response = await carServiceApi.put(`/customers/${customerId}`, customerData);
        return response.data;
    },

    // Delete customer
    deleteCustomer: async (customerId) => {
        const response = await carServiceApi.delete(`/customers/${customerId}`);
        return response.data;
    },

    // Update customer status (activate/deactivate)
    updateCustomerStatus: async (customerId, isActive) => {
        const response = await carServiceApi.patch(`/customers/${customerId}/status`, { is_active: isActive });
        return response.data;
    },
};

export default customerService;
