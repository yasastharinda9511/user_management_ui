import React, { useState, useEffect } from 'react';
import { X, Ship, Calendar, MapPin, User, Clock, ArrowRight, Package, Anchor, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { vehicleService } from '../../../api/index.js';

const ShippingHistory = ({ vehicleId, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchShippingHistory();
    }, [vehicleId]);

    const fetchShippingHistory = async () => {
        try {
            setLoading(true);
            const response = await vehicleService.getVehicleShippingHistory(vehicleId);
            const historyData = response.data || [];
            // Sort by changed_at descending (newest first)
            const sorted = historyData.sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
            setHistory(sorted);
        } catch (err) {
            console.error('Failed to fetch shipping history:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'PROCESSING': {
                color: 'bg-orange-100 text-orange-800 border-orange-300',
                icon: Package,
                label: 'Processing',
                description: 'Vehicle is being processed'
            },
            'SHIPPED': {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                icon: Ship,
                label: 'Shipped',
                description: 'Vehicle is on the way'
            },
            'ARRIVED': {
                color: 'bg-purple-100 text-purple-800 border-purple-300',
                icon: Anchor,
                label: 'Arrived',
                description: 'Vehicle has arrived at port'
            },
            'CLEARED': {
                color: 'bg-blue-100 text-blue-800 border-blue-300',
                icon: CheckCircle,
                label: 'Cleared',
                description: 'Customs clearance completed'
            },
            'DELIVERED': {
                color: 'bg-green-100 text-green-800 border-green-300',
                icon: CheckCircle,
                label: 'Delivered',
                description: 'Vehicle delivered successfully'
            }
        };
        return configs[status] || {
            color: 'bg-gray-100 text-gray-800 border-gray-300',
            icon: Package,
            label: status,
            description: 'Status update'
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (hours) => {
        if (!hours || hours === 0) return 'Less than 1 hour';

        const days = Math.floor(hours / 24);
        const remainingHours = Math.floor(hours % 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours}h` : ''}`;
        }
        return `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
    };

    // Calculate statistics
    const calculateStats = () => {
        if (history.length === 0) return null;

        const totalDuration = history.reduce((sum, entry) => sum + (entry.hours_in_previous_status || 0), 0);
        const avgDuration = totalDuration / history.length;

        return {
            totalChanges: history.length,
            avgDuration: formatDuration(avgDuration),
            currentStatus: history[0]?.new_status
        };
    };

    const stats = calculateStats();

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 px-6 py-5 flex-shrink-0 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                                <Ship className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Shipping History
                                </h3>
                                {history.length > 0 && (
                                    <p className="text-sm text-white/90 font-medium">
                                        {history[0].make} {history[0].model} • {history[0].chassis_id}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                {stats && !loading && !error && (
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="flex items-center space-x-2 mb-1">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                    <p className="text-xs font-medium text-gray-600">Total Changes</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">{stats.totalChanges}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="flex items-center space-x-2 mb-1">
                                    <Clock className="w-4 h-4 text-cyan-600" />
                                    <p className="text-xs font-medium text-gray-600">Avg Duration</p>
                                </div>
                                <p className="text-lg font-bold text-cyan-600">{stats.avgDuration}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="flex items-center space-x-2 mb-1">
                                    <CheckCircle className="w-4 h-4 text-teal-600" />
                                    <p className="text-xs font-medium text-gray-600">Current Status</p>
                                </div>
                                <p className="text-sm font-bold text-teal-600">{getStatusConfig(stats.currentStatus).label}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto flex-1 bg-gray-50">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                                    <Ship className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <p className="text-gray-600 mt-4 font-medium">Loading shipping history...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start space-x-3">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-red-900 font-semibold mb-1">Error Loading History</h4>
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Ship className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Shipping History</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                No status changes have been recorded yet. Shipping history will appear here once the vehicle goes through the shipping process.
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-cyan-300 to-teal-300"></div>

                            {/* History entries */}
                            <div className="space-y-8">
                                {history.map((entry, index) => {
                                    const oldStatusConfig = getStatusConfig(entry.old_status);
                                    const newStatusConfig = getStatusConfig(entry.new_status);
                                    const OldIcon = oldStatusConfig.icon;
                                    const NewIcon = newStatusConfig.icon;

                                    return (
                                        <div key={entry.id} className="relative pl-20">
                                            {/* Timeline dot with pulse animation for current */}
                                            <div className="absolute left-8 -ml-3 w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                                                {index === 0 && (
                                                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                                                )}
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>

                                            {/* Entry card */}
                                            <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                                {/* Status change header */}
                                                <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center space-x-3">
                                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${oldStatusConfig.color} shadow-sm`}>
                                                                <OldIcon className="w-3.5 h-3.5 mr-1.5" />
                                                                {oldStatusConfig.label}
                                                            </span>
                                                            <ArrowRight className="w-5 h-5 text-gray-400" />
                                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${newStatusConfig.color} shadow-sm`}>
                                                                <NewIcon className="w-3.5 h-3.5 mr-1.5" />
                                                                {newStatusConfig.label}
                                                            </span>
                                                        </div>
                                                        {index === 0 && (
                                                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">
                                                                CURRENT
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 italic">{newStatusConfig.description}</p>
                                                </div>

                                                <div className="p-5">
                                                    {/* Shipping details in a grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        {entry.vessel_name && (
                                                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <Ship className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Vessel</p>
                                                                    <p className="text-sm font-semibold text-gray-900">{entry.vessel_name}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {entry.departure_harbour && (
                                                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                                                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <MapPin className="w-4 h-4 text-teal-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Departure Port</p>
                                                                    <p className="text-sm font-semibold text-gray-900">{entry.departure_harbour}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Dates */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        {entry.shipment_date && (
                                                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                                    <p className="text-xs font-medium text-blue-600">Shipped</p>
                                                                </div>
                                                                <p className="text-sm font-semibold text-blue-900">{formatDate(entry.shipment_date)}</p>
                                                            </div>
                                                        )}
                                                        {entry.arrival_date && (
                                                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <Calendar className="w-4 h-4 text-purple-600" />
                                                                    <p className="text-xs font-medium text-purple-600">Arrived</p>
                                                                </div>
                                                                <p className="text-sm font-semibold text-purple-900">{formatDate(entry.arrival_date)}</p>
                                                            </div>
                                                        )}
                                                        {entry.clearing_date && (
                                                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <Calendar className="w-4 h-4 text-green-600" />
                                                                    <p className="text-xs font-medium text-green-600">Cleared</p>
                                                                </div>
                                                                <p className="text-sm font-semibold text-green-900">{formatDate(entry.clearing_date)}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Change info footer */}
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-100 space-y-2 md:space-y-0">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                                    <User className="w-3.5 h-3.5 text-gray-600" />
                                                                </div>
                                                                <span className="text-xs text-gray-600">
                                                                    <span className="font-semibold text-gray-900">{entry.changed_by}</span>
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                                                                </div>
                                                                <span className="text-xs text-gray-600">
                                                                    <span className="font-semibold text-gray-900">{formatDuration(entry.hours_in_previous_status)}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-medium">
                                                            {formatDate(entry.changed_at)}
                                                        </span>
                                                    </div>

                                                    {/* Remarks */}
                                                    {entry.change_remarks && (
                                                        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
                                                            <div className="flex items-start space-x-2">
                                                                <Package className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-semibold text-amber-700 mb-1">Remarks</p>
                                                                    <p className="text-sm text-gray-900">{entry.change_remarks}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end flex-shrink-0 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingHistory;
