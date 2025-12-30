import React, { useState, useEffect } from 'react';
import { X, Save, Key } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createPermission,
    selectUpdating
} from '../../../state/roleSlice.js';
import {ACTIONS, RESOURCES} from "../../../utils/resources.js";

const CreatePermissionModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const updating = useSelector(selectUpdating);

    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        action: '',
        resource: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const permissionData = {
            name: formData.name,
            action: formData.action,
            resource: formData.resource,
            description: formData.description
        };

        await dispatch(createPermission(permissionData));
        onClose();
    };

    // Common action suggestions
    const commonActions = [
        ACTIONS.ACCESS,
        ACTIONS.CREATE,
        ACTIONS.READ,
        ACTIONS.WRITE,
        ACTIONS.DELETE,
        ACTIONS.VIEW,
        ACTIONS.EDIT,
    ];

    // Common resource suggestions
    const commonResources = [
        RESOURCES.USERS,
        RESOURCES.ROLES,
        RESOURCES.PERMISSIONS,
        RESOURCES.CAR,
        RESOURCES.ANALYTICS,
        RESOURCES.SETTINGS,
        RESOURCES.FINANCIAL,
        RESOURCES.SALES,
        RESOURCES.SHIPPING,
        RESOURCES.PURCHASE,
        RESOURCES.CUSTOMERS,
        RESOURCES.SUPPLIERS,
        RESOURCES.NOTIFICATION
    ];

    return (
        <div className={`modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${isClosing ? 'closing' : ''}`}>
            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal panel */}
                <div className={`modal-content relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-2xl ${isClosing ? 'closing' : ''}`}>
                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Key className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Create New Permission
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Define a new system permission
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Permission Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., user:create, role:delete"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    A unique identifier for this permission (usually action:resource)
                                </p>
                            </div>

                            {/* Action and Resource */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Action *
                                    </label>
                                    <select
                                        name="action"
                                        value={formData.action}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                    >
                                        <option value="">Select an action</option>
                                        {commonActions.map(action => (
                                            <option key={action} value={action}>
                                                {action}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        The action type (create, read, update, delete, etc.)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Resource *
                                    </label>
                                    <select
                                        name="resource"
                                        value={formData.resource}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                    >
                                        <option value="">Select a resource</option>
                                        {commonResources.map(resource => (
                                            <option key={resource} value={resource}>
                                                {resource}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        The resource this permission applies to
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe what this permission allows users to do..."
                                />
                            </div>

                            {/* Preview */}
                            {formData.action && formData.resource && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-blue-900 mb-1">Preview:</p>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            {formData.action}
                                        </span>
                                        <span className="text-gray-600">on</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                            {formData.resource}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updating || !formData.name || !formData.action || !formData.resource}
                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                <span>{updating ? 'Creating...' : 'Create Permission'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePermissionModal;
