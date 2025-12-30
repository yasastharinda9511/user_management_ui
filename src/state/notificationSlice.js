import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../api/notificationService';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (params, { rejectWithValue }) => {
        try {
            const response = await notificationService.getNotifications(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            await notificationService.markAsRead(notificationId);
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await notificationService.markAllAsRead();
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (notificationId, { rejectWithValue }) => {
        try {
            await notificationService.deleteNotification(notificationId);
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        pagination: {
            total: 0,
            page: 1,
            page_size: 20,
            total_pages: 0
        },
        loading: false,
        error: null,
        unreadCount: 0
    },
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.pagination = {
                total: 0,
                page: 1,
                page_size: 20,
                total_pages: 0
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications || [];
                state.pagination = action.payload.pagination || state.pagination;
                state.unreadCount = state.notifications.filter(n => !n.read).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.notification_id === action.payload);
                if (notification) {
                    notification.read = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.read = true);
                state.unreadCount = 0;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(
                    n => n.notification_id !== action.payload
                );
                state.pagination.total = Math.max(0, state.pagination.total - 1);
            });
    }
});

export const { clearNotifications } = notificationSlice.actions;

export const selectNotifications = (state) => state.notifications.notifications;
export const selectNotificationsPagination = (state) => state.notifications.pagination;
export const selectNotificationsLoading = (state) => state.notifications.loading;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

export default notificationSlice.reducer;
