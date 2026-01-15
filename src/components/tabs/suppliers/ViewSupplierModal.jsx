import React from 'react';
import { X, Building2, Mail, Phone, MapPin, Tag, Globe } from 'lucide-react';

const ViewSupplierModal = ({ supplier, onClose }) => {
    if (!supplier) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-700 dark:text-gray-300">No supplier data available</p>
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
                                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Supplier Details
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    View supplier information
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
                        {/* Supplier ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Supplier ID
                            </label>
                            <p className="text-base text-gray-900 dark:text-white">
                                {supplier.id || 'N/A'}
                            </p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                <div className="flex items-center space-x-2">
                                    <Building2 className="w-4 h-4" />
                                    <span>Supplier Name</span>
                                </div>
                            </label>
                            <p className="text-base text-gray-900 dark:text-white">
                                {supplier.supplier_title ? `${supplier.supplier_title} ` : ''}
                                {supplier.supplier_name || 'N/A'}
                            </p>
                        </div>

                        {/* Type and Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center space-x-2">
                                        <Tag className="w-4 h-4" />
                                        <span>Supplier Type</span>
                                    </div>
                                </label>
                                {supplier.supplier_type ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
                                        {supplier.supplier_type}
                                    </span>
                                ) : (
                                    <p className="text-base text-gray-900 dark:text-white">N/A</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center space-x-2">
                                        <Globe className="w-4 h-4" />
                                        <span>Country</span>
                                    </div>
                                </label>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {supplier.country || 'N/A'}
                                </p>
                            </div>
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
                                    {supplier.contact_number || 'N/A'}
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
                                    {supplier.email || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Address */}
                        {supplier.address && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>Address</span>
                                    </div>
                                </label>
                                <p className="text-base text-gray-900 dark:text-white whitespace-pre-line">
                                    {supplier.address}
                                </p>
                            </div>
                        )}

                        {/* Other Contacts */}
                        {supplier.other_contacts && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Other Contacts
                                </label>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {supplier.other_contacts}
                                </p>
                            </div>
                        )}

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Status
                            </label>
                            {supplier.is_active !== undefined ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium ${
                                    supplier.is_active
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                }`}>
                                    {supplier.is_active ? 'Active' : 'Inactive'}
                                </span>
                            ) : (
                                <p className="text-base text-gray-900 dark:text-white">N/A</p>
                            )}
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

export default ViewSupplierModal;
