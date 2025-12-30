import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Bell,
    BellOff,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CheckCheck,
    Package,
    TruckIcon,
    AlertCircle,
    Info,
    CheckCircle,
    Car,
    UserCircle
} from 'lucide-react';
import {
    fetchNotifications,
    markAllNotificationsAsRead,
    selectNotifications,
    selectNotificationsPagination,
    selectNotificationsLoading,
    selectUnreadCount
} from '../../../state/notificationSlice';

const Notifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);
    const pagination = useSelector(selectNotificationsPagination);
    const loading = useSelector(selectNotificationsLoading);
    const unreadCount = useSelector(selectUnreadCount);

    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadNotifications(currentPage);
    }, [currentPage]);

    const loadNotifications = async (page) => {
        setRefreshing(true);
        await dispatch(fetchNotifications({ page, page_size: 20 }));
        setRefreshing(false);
    };

    const handleRefresh = () => {
        loadNotifications(currentPage);
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsAsRead(pagination.total));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            setCurrentPage(newPage);
        }
    };

    const getNotificationIcon = (type, priority) => {
        switch (type) {
            case 'vehicle_created':
                return <Car className="w-5 h-5 text-green-600" />;
            case 'customer_created':
                return <UserCircle className="w-5 h-5 text-green-600" />;
            case 'purchase_status':
                return <Package className="w-5 h-5 text-blue-600" />;
            case 'shipping_status':
                return <TruckIcon className="w-5 h-5 text-purple-600" />;
            case 'alert':
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            default:
                return <Info className="w-5 h-5 text-gray-600" />;
        }
    };

    const getPriorityBadge = (priority) => {
        const styles = {
            high: 'bg-red-100 text-red-800 border-red-200',
            urgent: 'bg-red-100 text-red-800 border-red-200',
            normal: 'bg-blue-100 text-blue-800 border-blue-200',
            low: 'bg-gray-100 text-gray-800 border-gray-200'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[priority] || styles.normal}`}>
                {priority || 'normal'}
            </span>
        );
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const NotificationCard = ({ notification, index }) => {
        const payload = notification.payload || {};

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-50">
                        {getNotificationIcon(notification.notification_type, notification.priority)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {notification.notification_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h3>
                                    {getPriorityBadge(notification.priority)}
                                </div>
                                <p className="text-sm text-gray-600">{payload.message}</p>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        {(payload.vehicle_code || payload.make || payload.model) && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-2">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    {payload.vehicle_code && (
                                        <div>
                                            <span className="text-gray-500">Vehicle:</span>
                                            <span className="ml-1 font-medium text-gray-900">{payload.vehicle_code}</span>
                                        </div>
                                    )}
                                    {payload.make && payload.model && (
                                        <div>
                                            <span className="text-gray-500">Model:</span>
                                            <span className="ml-1 font-medium text-gray-900">{payload.make} {payload.model}</span>
                                        </div>
                                    )}
                                    {payload.year && (
                                        <div>
                                            <span className="text-gray-500">Year:</span>
                                            <span className="ml-1 font-medium text-gray-900">{payload.year}</span>
                                        </div>
                                    )}
                                    {payload.chassis_id && (
                                        <div>
                                            <span className="text-gray-500">Chassis:</span>
                                            <span className="ml-1 font-medium text-gray-900">{payload.chassis_id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Status Changes */}
                        {(payload.old_status && payload.new_status) && (
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-300">
                                    {payload.old_status.replace(/_/g, ' ')}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded border border-green-300">
                                    {payload.new_status.replace(/_/g, ' ')}
                                </span>
                            </div>
                        )}

                        {/* Customer/Supplier Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                                {payload.customer_name && (
                                    <span>Customer: {payload.customer_name}</span>
                                )}
                                {payload.supplier_name && (
                                    <span>Supplier: {payload.supplier_name}</span>
                                )}
                                {notification.reference_id && (
                                    <span>Ref: {notification.reference_id}</span>
                                )}
                            </div>
                            <span>{formatTimestamp(notification.timestamp)}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading && notifications.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark all as read
                        </button>
                    )}
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Read</p>
                            <p className="text-2xl font-bold text-gray-900">{pagination.total - unreadCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <BellOff className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Unread</p>
                            <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
                    <p className="text-gray-600">When you receive notifications, they will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification, index) => (
                        <NotificationCard key={notification.notification_id} notification={notification} index={index} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
                    <div className="text-sm text-gray-600">
                        Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total notifications)
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(Math.min(5, pagination.total_pages))].map((_, i) => {
                                let pageNum;
                                if (pagination.total_pages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= pagination.total_pages - 2) {
                                    pageNum = pagination.total_pages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 rounded-lg transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.total_pages}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
