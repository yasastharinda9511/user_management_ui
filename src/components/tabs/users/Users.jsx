import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Mail, Phone, User, Calendar, CheckCircle, XCircle, RefreshCw, Edit, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUsers,
    selectUsers,
    selectTotalCount,
    selectLoading,
    selectError,
    selectUpdating,
    selectActiveUsersCount,
    selectVerifiedUsersCount
} from '../../../state/userSlice.js';
import EditUserModal from './EditUserModal.jsx';
import LoadingOverlay from '../../common/LoadingOverlay.jsx';

const Users = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectUsers);
    const totalCount = useSelector(selectTotalCount);
    const loading = useSelector(selectLoading);
    const updating = useSelector(selectUpdating);
    const error = useSelector(selectError);
    const activeUsersCount = useSelector(selectActiveUsersCount);
    const verifiedUsersCount = useSelector(selectVerifiedUsersCount);

    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchUsers());
    };

    useEffect(()=>{
        if(!updating){
            dispatch(fetchUsers());
        }
    },[updating])

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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage and view all registered users in the system
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Users: <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Content Area with Loading Overlay */}
            <div className="relative" style={{ minHeight: 'calc(100vh - 300px)' }}>
                {loading && <LoadingOverlay message="Loading users..." icon={UsersIcon} />}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                            <p className="text-red-800 dark:text-red-300">Error: {error}</p>
                        </div>
                    </div>
                )}

                {/* No Users */}
                {!loading && !error && users.length === 0 && (
                    <div className="text-center py-12">
                        <UsersIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
                        <p className="text-gray-600 dark:text-gray-400">There are no registered users in the system.</p>
                    </div>
                )}

                {/* Users Table */}
                {!loading && users.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Last Login
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                                        <span className="text-white font-medium text-sm">
                                                            {user.first_name?.[0]}{user.last_name?.[0]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.first_name} {user.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        @{user.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.role ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    {user.role.name || user.role}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 dark:text-gray-500 italic">No role</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center">
                                                    {user.is_active ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    {user.is_email_verified ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Unverified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                {formatDate(user.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(user.last_login)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => setEditingUser(user)}
                                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                            >
                                                <Edit className="w-3 h-3 mr-1" />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {/* Stats Cards */}
                {!loading && users.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {activeUsersCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Emails</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {verifiedUsersCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {totalCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                                <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    );
};

export default Users;
