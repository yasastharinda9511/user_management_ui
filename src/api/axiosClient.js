import axios from 'axios';
import config from '../configs/config.json';

// Create axios instances for different services
export const authApi = axios.create({
    baseURL: config.user_management_service.base_url,
    timeout: config.user_management_service.timeout_seconds * 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const carServiceApi = axios.create({
    baseURL: config.car_service.base_url,
    timeout: config.car_service.timeout_seconds * 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const imageServiceApi = axios.create({
    baseURL: config.image_service.base_url,
    timeout: config.image_service.timeout_seconds * 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const notificationServiceApi = axios.create({
    baseURL: config.notification_service.base_url,
    timeout: config.notification_service.timeout_seconds * 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor - Add auth token to all requests
const addAuthInterceptor = (apiInstance) => {
    apiInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                // Ensure headers object exists
                if (!config.headers) {
                    config.headers = {};
                }
                // Only add Authorization if not already present
                if (!config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Response interceptor - Handle errors globally with token refresh
const addResponseInterceptor = (apiInstance) => {
    apiInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // Handle specific error cases
            if (error.response) {
                // Server responded with error status
                switch (error.response.status) {
                    case 403:
                        // Don't try to refresh on login, refresh, or if already retried
                        if (originalRequest.url?.includes('/login') ||
                            originalRequest.url?.includes('/refresh') ||
                            originalRequest._retry) {
                            // Clear tokens and redirect to login
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            localStorage.removeItem('user_info');
                            window.location.href = '/car-app/login';
                            return Promise.reject(error);
                        }

                        // Try to refresh token
                        if (isRefreshing) {
                            // If already refreshing, queue this request
                            return new Promise((resolve, reject) => {
                                failedQueue.push({ resolve, reject });
                            })
                                .then(token => {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                    return apiInstance(originalRequest);
                                })
                                .catch(err => {
                                    return Promise.reject(err);
                                });
                        }

                        originalRequest._retry = true;
                        isRefreshing = true;

                        const refreshToken = localStorage.getItem('refresh_token');

                        if (!refreshToken) {
                            // No refresh token available
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('user_info');
                            window.location.href = '/car-app/login';
                            return Promise.reject(error);
                        }

                        try {
                            // Call refresh endpoint
                            const response = await authApi.post('/refresh', {
                                refresh_token: refreshToken
                            });

                            const { access_token, refresh_token: newRefreshToken } = response.data;

                            // Update tokens in localStorage
                            localStorage.setItem('access_token', access_token);
                            if (newRefreshToken) {
                                localStorage.setItem('refresh_token', newRefreshToken);
                            }

                            // Update authorization header
                            originalRequest.headers.Authorization = `Bearer ${access_token}`;

                            // Process queued requests
                            processQueue(null, access_token);

                            // Retry original request
                            return apiInstance(originalRequest);
                        } catch (refreshError) {
                            // Refresh token failed - logout user
                            processQueue(refreshError, null);
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            localStorage.removeItem('user_info');
                            window.location.href = '/car-app/login';
                            return Promise.reject(refreshError);
                        } finally {
                            isRefreshing = false;
                        }
                    case 404:
                        console.error('Resource not found');
                        break;
                    case 500:
                        console.error('Internal server error');
                        break;
                    default:
                        console.error('API Error:', error.response.status);
                }
            } else if (error.request) {
                // Request made but no response received
                console.error('Network error - No response received');
            } else {
                // Something else happened
                console.error('Error:', error.message);
            }
            return Promise.reject(error);
        }
    );
};

// Apply interceptors to all instances
addAuthInterceptor(authApi);
addAuthInterceptor(carServiceApi);
addAuthInterceptor(imageServiceApi);
addAuthInterceptor(notificationServiceApi);

addResponseInterceptor(authApi);
addResponseInterceptor(carServiceApi);
addResponseInterceptor(imageServiceApi);
addResponseInterceptor(notificationServiceApi);

export default {
    authApi,
    carServiceApi,
    imageServiceApi,
    notificationServiceApi,
};
