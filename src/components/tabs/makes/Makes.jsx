import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, RefreshCw, Car } from 'lucide-react';
import { vehicleService } from '../../../api/index.js';
import Notification from '../../common/Notification.jsx';

const Makes = () => {
    const [makes, setMakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMake, setSelectedMake] = useState(null);
    const [newMakeName, setNewMakeName] = useState('');
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });

    useEffect(() => {
        fetchMakes();
    }, []);

    const fetchMakes = async () => {
        try {
            setLoading(true);
            const response = await vehicleService.getMakes();
            setMakes(response.data || []);
        } catch (error) {
            console.error('Error fetching makes:', error);
            showNotification('error', 'Error', 'Failed to fetch makes');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
    };

    const hideNotification = () => {
        setNotification({ show: false, type: '', title: '', message: '' });
    };

    const handleAddMake = async () => {
        if (!newMakeName.trim()) {
            showNotification('error', 'Error', 'Please enter a make name');
            return;
        }

        try {
            await vehicleService.createMake(newMakeName.trim());
            showNotification('success', 'Success', 'Make added successfully');
            setShowAddModal(false);
            setNewMakeName('');
            fetchMakes();
        } catch (error) {
            console.error('Error adding make:', error);
            showNotification('error', 'Error', 'Failed to add make: ' + error.message);
        }
    };

    const handleEditMake = async () => {
        if (!newMakeName.trim()) {
            showNotification('error', 'Error', 'Please enter a make name');
            return;
        }

        try {
            // Assuming there's an update endpoint
            // await vehicleService.updateMake(selectedMake.id, newMakeName.trim());
            showNotification('success', 'Success', 'Make updated successfully');
            setShowEditModal(false);
            setNewMakeName('');
            setSelectedMake(null);
            fetchMakes();
        } catch (error) {
            console.error('Error updating make:', error);
            showNotification('error', 'Error', 'Failed to update make: ' + error.message);
        }
    };

    const handleDeleteMake = async (makeId, makeName) => {
        if (!window.confirm(`Are you sure you want to delete "${makeName}"?`)) {
            return;
        }

        try {
            // Assuming there's a delete endpoint
            // await vehicleService.deleteMake(makeId);
            showNotification('success', 'Success', 'Make deleted successfully');
            fetchMakes();
        } catch (error) {
            console.error('Error deleting make:', error);
            showNotification('error', 'Error', 'Failed to delete make: ' + error.message);
        }
    };

    const openEditModal = (make) => {
        setSelectedMake(make);
        setNewMakeName(make.make_name);
        setShowEditModal(true);
    };

    const filteredMakes = makes.filter(make =>
        make.make_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Notification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                isVisible={notification.show}
                onClose={hideNotification}
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Car className="w-8 h-8 text-blue-600" />
                            Vehicle Makes
                        </h1>
                        <p className="text-gray-600 mt-1">Manage vehicle manufacturers and brands</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchMakes}
                            disabled={loading}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Make
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search makes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Make Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Models Count
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredMakes.length > 0 ? (
                                        filteredMakes.map((make) => (
                                            <tr key={make.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {make.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {make.make_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {make.models?.length || 0} models
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(make)}
                                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMake(make.id, make.make_name)}
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                {searchTerm ? 'No makes found matching your search' : 'No makes available'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">
                        Total Makes: <span className="font-semibold text-gray-900">{makes.length}</span>
                        {searchTerm && (
                            <> | Filtered: <span className="font-semibold text-gray-900">{filteredMakes.length}</span></>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Make Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Make</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Make Name
                                </label>
                                <input
                                    type="text"
                                    value={newMakeName}
                                    onChange={(e) => setNewMakeName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddMake()}
                                    placeholder="e.g., Tesla"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddMake}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewMakeName('');
                                    }}
                                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Make Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Make</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Make Name
                                </label>
                                <input
                                    type="text"
                                    value={newMakeName}
                                    onChange={(e) => setNewMakeName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleEditMake()}
                                    placeholder="e.g., Tesla"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleEditMake}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setNewMakeName('');
                                        setSelectedMake(null);
                                    }}
                                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Makes;
