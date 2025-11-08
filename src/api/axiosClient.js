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

// Request interceptor - Add auth token to all requests
const addAuthInterceptor = (apiInstance) => {
    apiInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Response interceptor - Handle errors globally
const addResponseInterceptor = (apiInstance) => {
    apiInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // Handle specific error cases
            if (error.response) {
                // Server responded with error status
                switch (error.response.status) {
                    case 401:
                        // Unauthorized - clear token and redirect to login
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/login';
                        break;
                    case 403:
                        console.error('Forbidden - Insufficient permissions');
                        break;
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

addResponseInterceptor(authApi);
addResponseInterceptor(carServiceApi);
addResponseInterceptor(imageServiceApi);

export default {
    authApi,
    carServiceApi,
    imageServiceApi,
};
