import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Calendar, Building2, User, Clock, ArrowRight, CreditCard, DollarSign } from 'lucide-react';
import { vehicleService } from '../../../api/index.js';

const PurchaseHistory = ({ vehicleId, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPurchaseHistory();
    }, [vehicleId]);

    const fetchPurchaseHistory = async () => {
        try {
            setLoading(true);
            const response = await vehicleService.getVehiclePurchaseHistory(vehicleId);
            const historyData = response.data || [];
            // Sort by changed_at descending (newest first)
            const sorted = historyData.sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
            setHistory(sorted);
        } catch (err) {
            console.error('Failed to fetch purchase history:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'LC_PENDING': 'bg-orange-100 text-orange-800 border-orange-200',
            'LC_OPENED': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'LC_RECEIVED': 'bg-green-100 text-green-800 border-green-200',
            'CANCELLED': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'LC_PENDING': Clock,
            'LC_OPENED': CreditCard,
            'LC_RECEIVED': ShoppingCart,
            'CANCELLED': X
        };
        const Icon = icons[status] || ShoppingCart;
        return <Icon className="w-4 h-4" />;
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

    const formatCurrency = (amount, currency = 'JPY') => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
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

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Purchase History
                                </h3>
                                {history.length > 0 && (
                                    <p className="text-sm text-white/80">
                                        {history[0].make} {history[0].model} - {history[0].chassis_id}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="text-gray-600 mt-4">Loading purchase history...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800">Error: {error}</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase history</h3>
                            <p className="text-gray-600">No status changes have been recorded yet.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            {/* History entries */}
                            <div className="space-y-6">
                                {history.map((entry, index) => (
                                    <div key={entry.id} className="relative pl-16">
                                        {/* Timeline dot */}
                                        <div className={`absolute left-6 -ml-2 w-4 h-4 rounded-full border-4 border-white shadow-md ${
                                            index === 0 ? 'bg-green-500' : 'bg-indigo-500'
                                        }`}></div>

                                        {/* Entry card */}
                                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                            {/* Status change header */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(entry.old_status)}`}>
                                                        {getStatusIcon(entry.old_status)}
                                                        <span className="ml-1.5">{entry.old_status}</span>
                                                    </span>
                                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(entry.new_status)}`}>
                                                        {getStatusIcon(entry.new_status)}
                                                        <span className="ml-1.5">{entry.new_status}</span>
                                                    </span>
                                                </div>
                                                {index === 0 && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                        Current
                                                    </span>
                                                )}
                                            </div>

                                            {/* Purchase details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                {entry.supplier_id && (
                                                    <div className="flex items-start space-x-2">
                                                        <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Supplier ID</p>
                                                            <p className="text-sm font-medium text-gray-900">{entry.supplier_id}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {entry.lc_bank && (
                                                    <div className="flex items-start space-x-2">
                                                        <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">LC Bank</p>
                                                            <p className="text-sm font-medium text-gray-900">{entry.lc_bank}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* LC Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                {entry.lc_number && (
                                                    <div className="flex items-start space-x-2">
                                                        <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">LC Number</p>
                                                            <p className="text-sm font-medium text-gray-900">{entry.lc_number}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {entry.lc_cost_jpy && (
                                                    <div className="flex items-start space-x-2">
                                                        <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">LC Cost</p>
                                                            <p className="text-sm font-medium text-gray-900">{formatCurrency(entry.lc_cost_jpy)}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Dates */}
                                            {entry.purchase_date && (
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                    <div className="flex items-start space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Purchase Date</p>
                                                            <p className="text-sm text-gray-900">{formatDate(entry.purchase_date)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Change info */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="text-xs text-gray-600">
                                                            Changed by: <span className="font-medium text-gray-900">{entry.changed_by}</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span className="text-xs text-gray-600">
                                                            Duration: <span className="font-medium text-gray-900">{formatDuration(entry.hours_in_previous_status)}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(entry.changed_at)}
                                                </span>
                                            </div>

                                            {/* Remarks */}
                                            {(entry.purchase_remarks || entry.change_remarks) && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">Remarks</p>
                                                    <p className="text-sm text-gray-900">{entry.change_remarks || entry.purchase_remarks}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary card at bottom */}
                            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Total Status Changes</p>
                                        <p className="text-2xl font-bold text-indigo-600">{history.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Current Status</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border mt-1 ${
                                            history.length > 0 ? getStatusColor(history[0].new_status) : ''
                                        }`}>
                                            {history.length > 0 && getStatusIcon(history[0].new_status)}
                                            <span className="ml-2">{history.length > 0 ? history[0].new_status : 'N/A'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistory;
