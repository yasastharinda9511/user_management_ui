import React, { useState, useEffect } from 'react';
import { X, Save, Shield, CheckSquare, Square } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateRole,
    fetchAllPermissions,
    selectAllPermissions,
    selectLoadingPermissions,
    selectUpdating
} from '../../../state/roleSlice.js';

const EditRoleModal = ({ role, onClose }) => {
    const dispatch = useDispatch();
    const allPermissions = useSelector(selectAllPermissions);
    const loadingPermissions = useSelector(selectLoadingPermissions);
    const updating = useSelector(selectUpdating);

    const [formData, setFormData] = useState({
        name: role.name || '',
        description: role.description || '',
    });

    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [isClosing, setIsClosing] = useState(false);

    // Fetch all permissions on mount
    useEffect(() => {
        dispatch(fetchAllPermissions());
    }, [dispatch]);

    // Initialize selected permissions when role or allPermissions change
    useEffect(() => {
        if (role.permissions) {
            const permissionIds = role.permissions.map(p => p.id);
            setSelectedPermissions(permissionIds);
        }
    }, [role.permissions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedPermissions.length === allPermissions.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(allPermissions.map(p => p.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const roleData = {
            role_name: formData.name,
            description: formData.description,
            permission_ids: selectedPermissions
        };

        await dispatch(updateRole({ roleId: role.id, roleData }));
        onClose();
    };

    // Group permissions by resource
    const groupedPermissions = allPermissions.reduce((acc, permission) => {
        const resource = permission.resource || 'other';
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(permission);
        return acc;
    }, {});

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    return (
        <div className={`modal-backdrop fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${isClosing ? 'closing' : ''}`}>
            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal panel */}
                <div className={`modal-content relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all w-full max-w-4xl ${isClosing ? 'closing' : ''}`}>
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Edit Role
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Update role details and permissions
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>


                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="e.g., admin, manager"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role ID
                                    </label>
                                    <input
                                        type="text"
                                        value={role.id}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Describe the role and its purpose..."
                                />
                            </div>

                            {/* Permissions Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Permissions ({selectedPermissions.length} selected)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                                    >
                                        {selectedPermissions.length === allPermissions.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>

                                {loadingPermissions ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg max-h-96 overflow-y-auto">
                                        {Object.keys(groupedPermissions).map(resource => (
                                            <div key={resource} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 font-medium text-sm text-gray-700 dark:text-gray-300 uppercase">
                                                    {resource}
                                                </div>
                                                <div className="px-4 py-2 space-y-2">
                                                    {groupedPermissions[resource].map(permission => (
                                                        <label
                                                            key={permission.id}
                                                            className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                                                        >
                                                            <div className="flex-shrink-0 mt-0.5">
                                                                {selectedPermissions.includes(permission.id) ? (
                                                                    <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                                ) : (
                                                                    <Square className="w-5 h-5 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {permission.action}
                                                                    </span>
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                                                                        {permission.name}
                                                                    </span>
                                                                </div>
                                                                {permission.description && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                        {permission.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => handlePermissionToggle(permission.id)}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`modal-content px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${isClosing ? 'closing' : ''}`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                <span>{updating ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditRoleModal;
