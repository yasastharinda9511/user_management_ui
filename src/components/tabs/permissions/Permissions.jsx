import React, { useEffect, useState } from 'react';
import { Key, RefreshCw, XCircle, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAllPermissions,
    deletePermission,
    selectAllPermissions,
    selectPermissionsCount,
    selectLoadingPermissions,
    selectError,
    selectUpdating
} from '../../../state/roleSlice.js';
import EditPermissionModal from './EditPermissionModal.jsx';
import CreatePermissionModal from './CreatePermissionModal.jsx';

const Permissions = () => {
    const dispatch = useDispatch();
    const permissions = useSelector(selectAllPermissions);
    const totalCount = useSelector(selectPermissionsCount);
    const loading = useSelector(selectLoadingPermissions);
    const updating = useSelector(selectUpdating);
    const error = useSelector(selectError);

    const [editingPermission, setEditingPermission] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllPermissions());
    }, [dispatch]);

    useEffect(() => {
        if (!updating) {
            dispatch(fetchAllPermissions());
        }
    }, [updating]);

    const handleRefresh = () => {
        dispatch(fetchAllPermissions());
    };

    const handleDelete = async (permissionId, permissionName) => {
        if (window.confirm(`Are you sure you want to delete the permission "${permissionName}"?`)) {
            await dispatch(deletePermission(permissionId));
        }
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

    // Group permissions by resource
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const resource = permission.resource || 'other';
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(permission);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Permissions</h1>
                    <p className="text-gray-600 mt-2">
                        Manage system permissions and access controls
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Total Permissions: <span className="font-semibold text-gray-900">{totalCount}</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Permission</span>
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading permissions...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        <p className="text-red-800">Error: {error}</p>
                    </div>
                </div>
            )}

            {/* No Permissions */}
            {!loading && !error && permissions.length === 0 && (
                <div className="text-center py-12">
                    <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No permissions found</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first permission.</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Permission</span>
                    </button>
                </div>
            )}

            {/* Permissions Table - Grouped by Resource */}
            {!loading && permissions.length > 0 && (
                <div className="space-y-4">
                    {Object.keys(groupedPermissions).sort().map(resource => (
                        <div key={resource} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Resource Header */}
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900 uppercase">
                                        {resource}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        ({groupedPermissions[resource].length} permissions)
                                    </span>
                                </div>
                            </div>

                            {/* Permissions Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {groupedPermissions[resource].map((permission) => (
                                            <tr key={permission.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <Key className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {permission.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {permission.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        {permission.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs">
                                                        {permission.description || (
                                                            <span className="text-gray-400 italic">No description</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(permission.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setEditingPermission(permission)}
                                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                        >
                                                            <Edit className="w-3 h-3 mr-1" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(permission.id, permission.name)}
                                                            disabled={updating}
                                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Trash2 className="w-3 h-3 mr-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Cards */}
            {!loading && permissions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {totalCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Key className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Resource Types</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {Object.keys(groupedPermissions).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique Actions</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {new Set(permissions.map(p => p.action)).size}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Key className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Permission Modal */}
            {showCreateModal && (
                <CreatePermissionModal
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* Edit Permission Modal */}
            {editingPermission && (
                <EditPermissionModal
                    permission={editingPermission}
                    onClose={() => setEditingPermission(null)}
                />
            )}
        </div>
    );
};

export default Permissions;
