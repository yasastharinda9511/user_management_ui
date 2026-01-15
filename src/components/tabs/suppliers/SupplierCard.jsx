import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, Mail, Phone, MapPin, Globe, Edit, Trash2, MoreVertical } from 'lucide-react';
import { deleteSupplier } from '../../../state/supplierSlice';
import { selectPermissions } from '../../../state/authSlice';
import { hasPermission } from '../../../utils/permissionUtils';
import { PERMISSIONS } from '../../../utils/permissions';
import ConfirmationModal from '../../common/ConfirmationModal';

const SupplierCard = ({ supplier, viewMode = 'grid', onEdit, onView }) => {
    const dispatch = useDispatch();
    const permissions = useSelector(selectPermissions);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const getSupplierTypeColor = (type) => {
        switch (type) {
            case 'AUCTION':
                return 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
            case 'DEALER':
                return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'PRIVATE':
                return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            default:
                return 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteSupplier(supplier.id)).unwrap();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete supplier:', error);
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
                    onClick={() => onView && onView(supplier)}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-lg">
                                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{supplier.supplier_name}</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSupplierTypeColor(supplier.supplier_type)}`}>
                                        {supplier.supplier_type}
                                    </span>
                                    {!supplier.is_active && (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                    {supplier.email && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            {supplier.email}
                                        </div>
                                    )}
                                    {supplier.contact_number && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            {supplier.contact_number}
                                        </div>
                                    )}
                                    {supplier.country && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Globe className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            {supplier.country}
                                        </div>
                                    )}
                                    {supplier.address && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                            {supplier.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {hasPermission(permissions, PERMISSIONS.SUPPLIER_UPDATE) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(supplier);
                                    }}
                                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            )}
                            {hasPermission(permissions, PERMISSIONS.SUPPLIER_DELETE) && (
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
                        title="Delete Supplier"
                        message={`Are you sure you want to delete "${supplier.supplier_name}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                        onConfirm={handleDelete}
                        onCancel={() => setShowDeleteModal(false)}
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
                onClick={() => onView && onView(supplier)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{supplier.supplier_name}</h3>
                                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getSupplierTypeColor(supplier.supplier_type)}`}>
                                    {supplier.supplier_type}
                                </span>
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
                                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                                    {hasPermission(permissions, PERMISSIONS.SUPPLIER_UPDATE) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(supplier);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                    {hasPermission(permissions, PERMISSIONS.SUPPLIER_DELETE) && (
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
                    {supplier.email && (
                        <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400 truncate">{supplier.email}</span>
                        </div>
                    )}
                    {supplier.contact_number && (
                        <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">{supplier.contact_number}</span>
                        </div>
                    )}
                    {supplier.country && (
                        <div className="flex items-center text-sm">
                            <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">{supplier.country}</span>
                        </div>
                    )}
                    {supplier.address && (
                        <div className="flex items-start text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-400 line-clamp-2">{supplier.address}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Added {formatDate(supplier.created_at)}</span>
                        {!supplier.is_active && (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-medium">
                                Inactive
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <ConfirmationModal
                    title="Delete Supplier"
                    message={`Are you sure you want to delete "${supplier.supplier_name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    type="danger"
                />
            )}
        </>
    );
};

export default SupplierCard;
