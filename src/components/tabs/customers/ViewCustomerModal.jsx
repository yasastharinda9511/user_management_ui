import React from 'react';
import { X, User, Mail, Phone, MapPin, Tag } from 'lucide-react';

const ViewCustomerModal = ({ customer, onClose }) => {
    if (!customer) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-700 dark:text-gray-300">No customer data available</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Customer Details
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    View customer information
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <div className="space-y-4">
                        {/* Customer ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Customer ID
                            </label>
                            <p className="text-base text-gray-900 dark:text-white">
                                {customer.id || customer.customer_id || 'N/A'}
                            </p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4" />
                                    <span>Name</span>
                                </div>
                            </label>
                            <p className="text-base text-gray-900 dark:text-white">
                                {customer.customer_title ? `${customer.customer_title} ` : ''}
                                {customer.customer_name || 'N/A'}
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4" />
                                        <span>Contact Number</span>
                                    </div>
                                </label>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {customer.contact_number || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4" />
                                        <span>Email</span>
                                    </div>
                                </label>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {customer.email || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Address */}
                        {customer.address && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>Address</span>
                                    </div>
                                </label>
                                <p className="text-base text-gray-900 dark:text-white whitespace-pre-line">
                                    {customer.address}
                                </p>
                            </div>
                        )}

                        {/* Other Contacts */}
                        {customer.other_contacts && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Other Contacts
                                </label>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {customer.other_contacts}
                                </p>
                            </div>
                        )}

                        {/* Customer Type and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center space-x-2">
                                        <Tag className="w-4 h-4" />
                                        <span>Customer Type</span>
                                    </div>
                                </label>
                                {customer.customer_type ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
                                        {customer.customer_type}
                                    </span>
                                ) : (
                                    <p className="text-base text-gray-900 dark:text-white">N/A</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Status
                                </label>
                                {customer.is_active !== undefined ? (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium ${
                                        customer.is_active
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                    }`}>
                                        {customer.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                ) : (
                                    <p className="text-base text-gray-900 dark:text-white">N/A</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewCustomerModal;
