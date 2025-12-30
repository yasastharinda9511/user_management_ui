import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../api/notificationService';

const LAST_SEEN_COUNT_KEY = 'last_seen_notification_count';

const getLastSeenCount = () => {
    const count = localStorage.getItem(LAST_SEEN_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
};

const setLastSeenCount = (count) => {
    localStorage.setItem(LAST_SEEN_COUNT_KEY, count.toString());
};

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

export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (totalCount, { rejectWithValue }) => {
        try {
            setLastSeenCount(totalCount);
            return totalCount;
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
        unreadCount: 0,
        lastSeenCount: getLastSeenCount()
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
                state.lastSeenCount = getLastSeenCount();
                state.unreadCount = Math.max(0, state.pagination.total - state.lastSeenCount);
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
                state.lastSeenCount = action.payload;
                state.unreadCount = 0;
            });
    }
});

export const { clearNotifications } = notificationSlice.actions;

export const selectNotifications = (state) => state.notifications.notifications;
export const selectNotificationsPagination = (state) => state.notifications.pagination;
export const selectNotificationsLoading = (state) => state.notifications.loading;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectLastSeenCount = (state) => state.notifications.lastSeenCount;

export default notificationSlice.reducer;
