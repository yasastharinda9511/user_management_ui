# API Services Documentation

This directory contains centralized API client configuration and service modules for the application.

## Structure

```
api/
├── axiosClient.js      # Axios instances with interceptors
├── authService.js      # Authentication-related API calls
├── userService.js      # User management API calls
├── vehicleService.js   # Vehicle management API calls
├── index.js           # Centralized exports
└── README.md          # This file
```

## Axios Client Configuration

### Features
- **Multiple API instances** for different services (auth, car service, image service)
- **Request interceptors** to automatically add authentication tokens
- **Response interceptors** for global error handling
- **Automatic token refresh** on 401 errors
- **Base URL and timeout** configuration from config.json

### Available Instances
```javascript
import { authApi, carServiceApi, imageServiceApi } from './axiosClient';
```

## Service Modules

### Auth Service
Handles authentication operations:
- `login(credentials)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `refreshToken(refreshToken)` - Refresh access token
- `introspect(token)` - Verify token
- `requestPasswordReset(email)` - Request password reset
- `resetPassword(data)` - Reset password with token
- `verifyEmail(token)` - Verify email address
- `changePassword(data)` - Change user password

### User Service
Handles user management:
- `getAllUsers()` - Fetch all users
- `getUserById(userId)` - Fetch specific user
- `createUser(userData)` - Create new user
- `updateUser(userId, userData)` - Update user details
- `deleteUser(userId)` - Delete user
- `updateUserStatus(userId, isActive)` - Activate/deactivate user

### Vehicle Service
Handles vehicle operations:
- `getAllVehicles({ page, limit, filters })` - Fetch vehicles with pagination
- `getVehicleById(vehicleId)` - Fetch specific vehicle
- `createVehicle(vehicleData)` - Create new vehicle
- `updateVehicle(vehicleId, updateData)` - Update vehicle
- `updateVehiclePurchase(vehicleId, purchaseData)` - Update purchase info
- `updateVehicleShipping(vehicleId, shippingData)` - Update shipping info
- `updateVehicleFinancials(vehicleId, financialData)` - Update financials
- `updateVehicleSales(vehicleId, salesData)` - Update sales info
- `createVehicleWithImages(vehicleData, images)` - Create vehicle with images
- `getDropdownOptions()` - Fetch filter options

## Usage in Redux Slices

### Example: User Slice
```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../api/userService';

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.getAllUsers();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
```

### Example: Direct Component Usage
```javascript
import { userService } from '../api';

const MyComponent = () => {
    const handleFetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            console.log(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
};
```

## Error Handling

The axios client automatically handles common errors:
- **401 Unauthorized**: Clears tokens and redirects to login
- **403 Forbidden**: Logs insufficient permissions
- **404 Not Found**: Logs resource not found
- **500 Server Error**: Logs internal server error
- **Network Errors**: Logs connection issues

## Authentication

All requests automatically include the Bearer token from localStorage:
```javascript
// Automatically added by request interceptor
headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
}
```

## Adding New Services

1. Create a new service file (e.g., `reportService.js`)
2. Import the appropriate API client
3. Define service methods
4. Export the service
5. Add export to `index.js`

Example:
```javascript
// reportService.js
import { carServiceApi } from './axiosClient';

const reportService = {
    getMonthlyReport: async (month, year) => {
        const response = await carServiceApi.get('/reports/monthly', {
            params: { month, year }
        });
        return response.data;
    },
};

export default reportService;
```

## Best Practices

1. **Always use service modules** instead of direct fetch/axios calls
2. **Handle errors** in Redux slices using `rejectWithValue`
3. **Use try-catch blocks** when calling services
4. **Document new endpoints** as you add them
5. **Keep services focused** - one service per domain (users, vehicles, etc.)
6. **Use TypeScript interfaces** if you migrate to TypeScript
