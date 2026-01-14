import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Tag, Edit, Trash2, MoreVertical } from 'lucide-react';
import { deleteCustomer } from '../../../state/customerSlice';
import { selectPermissions } from '../../../state/authSlice';
import { hasPermission } from '../../../utils/permissionUtils';
import { PERMISSIONS } from '../../../utils/permissions';
import ConfirmationModal from '../../common/ConfirmationModal';

const CustomerCard = ({ customer, viewMode = 'grid', onEdit, onView }) => {
    const dispatch = useDispatch();
    const permissions = useSelector(selectPermissions);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleDelete = async () => {
        try {
            await dispatch(deleteCustomer(customer.id || customer.customer_id)).unwrap();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete customer:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (viewMode === 'list') {
        return (
            <>
                <div
                    onClick={() => onView && onView(customer)}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                            <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        {customer.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {customer.customer_title ? `${customer.customer_title} ` : ''}
                                        {customer.customer_name}
                                    </h3>
                                    {customer.customer_type && (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700">
                                            {customer.customer_type}
                                        </span>
                                    )}
                                    {!customer.is_active && (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                {customer.other_contacts && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{customer.other_contacts}</p>
                                )}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                                    {customer.email && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            {customer.email}
                                        </div>
                                    )}
                                    {customer.contact_number && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            {customer.contact_number}
                                        </div>
                                    )}
                                    {customer.address && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            {customer.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {hasPermission(permissions, PERMISSIONS.CUSTOMER_UPDATE) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(customer);
                                    }}
                                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            )}
                            {hasPermission(permissions, PERMISSIONS.CUSTOMER_DELETE) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteModal(true);
                                    }}
                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {showDeleteModal && (
                    <ConfirmationModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDelete}
                        title="Delete Customer"
                        message={`Are you sure you want to delete "${customer.customer_name}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                        type="danger"
                    />
                )}
            </>
        );
    }

    // Grid View
    return (
        <>
            <div
                onClick={() => onView && onView(customer)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-sm">
                                <span className="text-white font-medium text-sm">
                                    {customer.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {customer.customer_title ? `${customer.customer_title} ` : ''}
                                    {customer.customer_name}
                                </h3>
                                {customer.customer_type && (
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700">
                                        <Tag className="w-3 h-3 inline mr-1" />
                                        {customer.customer_type}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                                    {hasPermission(permissions, PERMISSIONS.CUSTOMER_UPDATE) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(customer);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                    {hasPermission(permissions, PERMISSIONS.CUSTOMER_DELETE) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDeleteModal(true);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">

                        <div className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-2">
                            {customer.other_contacts || ''}
                        </div>

                        <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300 truncate">{customer.email || ""}</span>
                        </div>


                        <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">{customer.contact_number || ""}</span>
                        </div>


                    <div className="flex items-start text-sm">
                        <MapPin
                            className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5"/>
                        <span className="text-gray-600 dark:text-gray-300 max-h-[20px] overflow-hidden">
                            {customer.address || ''}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Added {formatDate(customer.created_at)}</span>
                        {customer.is_active ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                                Active
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-medium">
                                Inactive
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Customer"
                    message={`Are you sure you want to delete "${customer.customer_name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                />
            )}
        </>
    );
};

export default CustomerCard;
