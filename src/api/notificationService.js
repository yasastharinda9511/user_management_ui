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
    },

    markAsRead: async (notificationId) => {
        const response = await notificationServiceApi.put(`/notifications/${notificationId}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await notificationServiceApi.put('/notifications/read-all');
        return response.data;
    },

    deleteNotification: async (notificationId) => {
        const response = await notificationServiceApi.delete(`/notifications/${notificationId}`);
        return response.data;
    }
};

export default notificationService;
