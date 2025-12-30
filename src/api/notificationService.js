import { notificationServiceApi } from './axiosClient.js';

const notificationService = {
    getNotifications: async (params = {}) => {
        const { page = 1, page_size = 20 } = params;
        const response = await notificationServiceApi.get('/notifications', {
            params: {
                page,
                page_size
            }
        });
        return response.data;
    }
};

export default notificationService;
