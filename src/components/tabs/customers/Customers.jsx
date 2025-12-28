import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, User, MapPin, CheckCircle, XCircle, RefreshCw, Edit, Plus, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
    fetchCustomers,
    selectCustomers,
    selectTotalCount,
    selectLoading,
    selectError,
    selectUpdating,
    selectActiveCustomersCount
} from '../../../state/customerSlice.js';
import CreateCustomerModal from './CreateCustomerModal.jsx';
import EditCustomerModal from './EditCustomerModal.jsx';

const Customers = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const customers = useSelector(selectCustomers);
    const totalCount = useSelector(selectTotalCount);
    const loading = useSelector(selectLoading);
    const updating = useSelector(selectUpdating);
    const error = useSelector(selectError);
    const activeCustomersCount = useSelector(selectActiveCustomersCount);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    // Check if navigated with selected customer from search
    useEffect(() => {
        if (location.state?.selectedCustomer) {
            setEditingCustomer(location.state.selectedCustomer);
            // Clear the state to prevent reopening on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleRefresh = () => {
        dispatch(fetchCustomers());
    };

    useEffect(() => {
        if (!updating) {
            dispatch(fetchCustomers());
        }
    }, [updating]);

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

    // Filter customers based on search term
    const filteredCustomers = customers.filter(customer => {
        const search = searchTerm.toLowerCase();
        return (
            customer.customer_name?.toLowerCase().includes(search) ||
            customer.email?.toLowerCase().includes(search) ||
            customer.contact_number?.toLowerCase().includes(search) ||
            customer.customer_type?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-2">
                        Manage and view all customers in the system
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Total Customers: <span className="font-semibold text-gray-900">{totalCount}</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Customer</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search customers by name, email, phone, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading customers...</p>
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

            {/* No Customers */}
            {!loading && !error && filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'No customers found' : 'No customers yet'}
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first customer.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Customer
                        </button>
                    )}
                </div>
            )}

            {/* Customers Table */}
            {!loading && filteredCustomers.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id || customer.customer_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                                                        <span className="text-white font-medium text-sm">
                                                            {customer.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.customer_title ? `${customer.customer_title} ` : ''}
                                                        {customer.customer_name}
                                                    </div>
                                                    {customer.other_contacts && (
                                                        <div className="text-sm text-gray-500">
                                                            {customer.other_contacts}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                {customer.email && (
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                        {customer.email}
                                                    </div>
                                                )}
                                                {customer.contact_number && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                        {customer.contact_number}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start text-sm text-gray-900">
                                                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">
                                                    {customer.address || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {customer.customer_type ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {customer.customer_type}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No type</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {customer.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => setEditingCustomer(customer)}
                                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
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
            {!loading && customers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {activeCustomersCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Inactive Customers</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {totalCount - activeCustomersCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {totalCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Customer Modal */}
            {showCreateModal && (
                <CreateCustomerModal
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* Edit Customer Modal */}
            {editingCustomer && (
                <EditCustomerModal
                    customer={editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                />
            )}
        </div>
    );
};

export default Customers;
