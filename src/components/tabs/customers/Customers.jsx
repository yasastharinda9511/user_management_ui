import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, User, MapPin, CheckCircle, XCircle, RefreshCw, Edit, Plus, Tag, Search, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
    fetchCustomers,
    deleteCustomer,
    selectCustomers,
    selectTotalCount,
    selectLoading,
    selectError,
    selectUpdating,
    selectActiveCustomersCount,
    selectCurrentPage,
    selectTotalPages,
    selectPageLimit,
    selectTotalCustomers,
    setCurrentPage,
    setPageLimit
} from '../../../state/customerSlice.js';
import { selectPermissions } from '../../../state/authSlice';
import { hasPermission } from '../../../utils/permissionUtils';
import { PERMISSIONS } from '../../../utils/permissions';
import CreateCustomerModal from './CreateCustomerModal.jsx';
import EditCustomerModal from './EditCustomerModal.jsx';
import ViewCustomerModal from './ViewCustomerModal.jsx';
import ConfirmationModal from '../../common/ConfirmationModal';
import Notification from '../../common/Notification';
import LoadingOverlay from '../../common/LoadingOverlay.jsx';

const Customers = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const customers = useSelector(selectCustomers);
    const totalCount = useSelector(selectTotalCount);
    const loading = useSelector(selectLoading);
    const updating = useSelector(selectUpdating);
    const error = useSelector(selectError);
    const activeCustomersCount = useSelector(selectActiveCustomersCount);
    const currentPage = useSelector(selectCurrentPage);
    const totalPages = useSelector(selectTotalPages);
    const pageLimit = useSelector(selectPageLimit);
    const totalCustomers = useSelector(selectTotalCustomers);
    const permissions = useSelector(selectPermissions);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [notification, setNotification] = useState({
        isVisible: false,
        type: 'success',
        title: '',
        message: ''
    });

    // Debounce search term to avoid excessive API calls
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        dispatch(fetchCustomers({ page: currentPage, limit: pageLimit, search: debouncedSearchTerm }));
    }, [dispatch, currentPage, pageLimit, debouncedSearchTerm]);

    // Check if navigated with selected customer from search
    useEffect(() => {
        if (location.state?.selectedCustomer) {
            setViewingCustomer(location.state.selectedCustomer);
            // Clear the state to prevent reopening on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleRefresh = () => {
        dispatch(fetchCustomers({ page: currentPage, limit: pageLimit, search: debouncedSearchTerm }));
    };

    const handlePageChange = (pageNumber) => {
        dispatch(setCurrentPage(pageNumber));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageLimitChange = (newLimit) => {
        dispatch(setPageLimit(Number(newLimit)));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        dispatch(setCurrentPage(1)); // Reset to first page on search
    };

    useEffect(() => {
        if (!updating) {
            dispatch(fetchCustomers({ page: currentPage, limit: pageLimit, search: debouncedSearchTerm }));
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

    const showNotification = (type, title, message) => {
        setNotification({ isVisible: true, type, title, message });
    };

    const handleDeleteClick = (customer, e) => {
        console.log("delete button is clicked !!");
        e.stopPropagation();
        setCustomerToDelete(customer);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteCustomer(customerToDelete.id)).unwrap();
            setShowDeleteModal(false);
            setCustomerToDelete(null);
            showNotification('success', 'Success', 'Customer deleted successfully');
        } catch (error) {
            console.error('Failed to delete customer:', error);
            showNotification('error', 'Error', error || 'Failed to delete customer');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setCustomerToDelete(null);
    };

    // Check if user has any action permissions
    const hasAnyActionPermission = hasPermission(permissions, PERMISSIONS.CUSTOMER_UPDATE) ||
                                    hasPermission(permissions, PERMISSIONS.CUSTOMER_DELETE);

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
                        Total Customers: <span className="font-semibold text-gray-900">{totalCustomers}</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    {hasPermission(permissions, PERMISSIONS.CUSTOMER_CREATE) && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Customer</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search customers by name, email, phone, or type..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {/* Show loading indicator when debouncing or loading */}
                    {(searchTerm !== debouncedSearchTerm || (loading && searchTerm)) && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area with Loading Overlay */}
            <div className="relative" style={{ minHeight: 'calc(100vh - 400px)' }}>
                {loading && <LoadingOverlay message="Loading customers..." icon={Users} />}

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
            {!loading && !error && customers.length === 0 && (
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
            {!loading && customers.length > 0 && (
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
                                    {hasAnyActionPermission && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map((customer) => (
                                    <tr
                                        key={customer.id || customer.customer_id}
                                        onClick={() => setViewingCustomer(customer)}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
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
                                        {hasAnyActionPermission && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    {hasPermission(permissions, PERMISSIONS.CUSTOMER_UPDATE) && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingCustomer(customer);
                                                            }}
                                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                        >
                                                            <Edit className="w-3 h-3 mr-1" />
                                                            Edit
                                                        </button>
                                                    )}
                                                    {hasPermission(permissions, PERMISSIONS.CUSTOMER_DELETE) && (
                                                        <button
                                                            onClick={(e) => handleDeleteClick(customer, e)}
                                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3 mr-1" />
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                {/* Left side - Showing info */}
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * pageLimit + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(currentPage * pageLimit, totalCustomers)}</span> of{' '}
                                    <span className="font-medium">{totalCustomers}</span> customers
                                </div>

                                {/* Center - Page navigation */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    {/* Page numbers */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            // Show first page, last page, current page, and pages around current
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                            currentPage === pageNumber
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                pageNumber === currentPage - 2 ||
                                                pageNumber === currentPage + 2
                                            ) {
                                                return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>

                                {/* Right side - Items per page selector */}
                                <div className="flex items-center gap-2">
                                    <label htmlFor="pageLimit" className="text-sm font-medium text-gray-700">
                                        Items per page:
                                    </label>
                                    <select
                                        id="pageLimit"
                                        value={pageLimit}
                                        onChange={(e) => handlePageLimitChange(e.target.value)}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
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
                                    {totalCustomers - activeCustomersCount}
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
                                    {totalCustomers}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>

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

            {/* View Customer Modal */}
            {viewingCustomer && (
                <ViewCustomerModal
                    customer={viewingCustomer}
                    onClose={() => setViewingCustomer(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {customerToDelete && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    title="Delete Customer"
                    message={`Are you sure you want to delete "${customerToDelete.customer_name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDeleteConfirm}
                    onClose={handleDeleteCancel}
                    type="danger"
                />
            )}

            {/* Notification */}
            {notification.isVisible && (
                <Notification
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={() => setNotification({ ...notification, isVisible: false })}
                />
            )}
        </div>
    );
};

export default Customers;
