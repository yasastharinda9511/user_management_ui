import React from "react";
import {Car, AlertCircle, AlertTriangle, Package, TruckIcon, CheckCircle, UserCircle, Info, Store, Star} from "lucide-react";


const NotificationCard = ({ notification, index }) => {
    const payload = notification.payload || {};

    const getNotificationIcon = (type, priority) => {
        switch (type) {
            case 'vehicle_created':
                return <Car className="w-5 h-5 text-green-600" />;
            case 'vehicle_deleted':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'customer_deleted':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'customer_created':
                return <UserCircle className="w-5 h-5 text-green-600" />;
            case 'supplier_created':
                return <Store className="w-5 h-5 text-green-600" />;
            case 'purchase_status':
                return <Package className="w-5 h-5 text-blue-600" />;
            case 'shipping_status':
                return <TruckIcon className="w-5 h-5 text-purple-600" />;
            case 'vehicle_featured_status_changed':
                return <Star className="w-5 h-5 fill-yellow-600 text-yellow-600" />;
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

export default NotificationCard;