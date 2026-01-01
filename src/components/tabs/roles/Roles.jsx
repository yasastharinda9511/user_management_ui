import React, { useEffect, useState } from 'react';
import { Shield, RefreshCw, XCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchRoles,
    deleteRole,
    selectRoles,
    selectTotalCount,
    selectLoading,
    selectError,
    selectUpdating
} from '../../../state/roleSlice.js';
import EditRoleModal from './EditRoleModal.jsx';
import CreateRoleModal from './CreateRoleModal.jsx';
import LoadingOverlay from '../../common/LoadingOverlay.jsx';

const Roles = () => {
    const dispatch = useDispatch();
    const roles = useSelector(selectRoles);
    const totalCount = useSelector(selectTotalCount);
    const loading = useSelector(selectLoading);
    const updating = useSelector(selectUpdating);
    const error = useSelector(selectError);

    const [editingRole, setEditingRole] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    // useEffect(() => {
    //     if (!updating) {
    //         dispatch(fetchRoles());
    //     }
    // }, [updating]);

    const handleRefresh = () => {
        dispatch(fetchRoles());
    };

    const handleDelete = async (roleId, roleName) => {
        if (window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            await dispatch(deleteRole(roleId));
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
                    <p className="text-gray-600 mt-2">
                        Manage user roles and their associated permissions
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Total Roles: <span className="font-semibold text-gray-900">{totalCount}</span>
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
                        <span>New Role</span>
                    </button>
                </div>
            </div>

            {/* Content Area with Loading Overlay */}
            <div className="relative" style={{ minHeight: 'calc(100vh - 300px)' }}>
                {loading && <LoadingOverlay message="Loading roles..." icon={Shield} />}

                {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        <p className="text-red-800">Error: {error}</p>
                    </div>
                </div>
            )}

            {/* No Roles */}
            {!loading && !error && roles.length === 0 && (
                <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first role.</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Role</span>
                    </button>
                </div>
            )}

            {/* Roles Table */}
            {!loading && roles.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Permissions
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
                                {roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                                        <Shield className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {role.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {role.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs">
                                                {role.description || (
                                                    <span className="text-gray-400 italic">No description</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {role.permissions && role.permissions.length > 0 ? (
                                                <div className="flex flex-wrap gap-1 max-w-md">
                                                    {role.permissions.slice(0, 3).map((permission, idx) => (
                                                        <span
                                                            key={permission.id || idx}
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                            title={permission.description || ''}
                                                        >
                                                            {permission.action ? `${permission.action}:${permission.resource}` : permission.name}
                                                        </span>
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                            +{role.permissions.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-500 italic">No permissions</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(role.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditingRole(role)}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                >
                                                    <Edit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(role.id, role.name)}
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
            )}

            {/* Stats Cards */}
            {!loading && roles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {totalCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">With Permissions</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {roles.filter(r => r.permissions && r.permissions.length > 0).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Empty Roles</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {roles.filter(r => !r.permissions || r.permissions.length === 0).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>

            {/* Create Role Modal */}
            {showCreateModal && (
                <CreateRoleModal
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* Edit Role Modal */}
            {editingRole && (
                <EditRoleModal
                    role={editingRole}
                    onClose={() => setEditingRole(null)}
                />
            )}
        </div>
    );
};

export default Roles;
