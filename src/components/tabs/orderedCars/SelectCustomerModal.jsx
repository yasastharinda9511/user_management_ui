import React, { useState, useEffect } from 'react';
import {X, Search, Eye, Edit2, UserCircle, Plus} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCustomers,
    fetchCustomerById,
    selectCustomers,
    selectLoading,
    selectSelectedCustomer,
    selectLoadingCustomer
} from '../../../state/customerSlice.js';
import EditCustomerModal from '../customers/EditCustomerModal.jsx';
import CreateCustomerModal from '../customers/CreateCustomerModal.jsx';

const SelectCustomerModal = ({ currentCustomerId, onSelect, onClose }) => {
    const dispatch = useDispatch();
    const customers = useSelector(selectCustomers);
    const loading = useSelector(selectLoading);
    const selectedCustomer = useSelector(selectSelectedCustomer);
    const loadingCustomer = useSelector(selectLoadingCustomer);

    const [selectedCustomerId, setSelectedCustomerId] = useState(currentCustomerId || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch, showCreateCustomerModal]);

    const handleViewEditCustomer = async () => {
        if (!selectedCustomerId) {
            return;
        }

        try {
            await dispatch(fetchCustomerById(selectedCustomerId)).unwrap();
            setShowEditModal(true);
        } catch (error) {
            console.error('Failed to load customer:', error);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleConfirmSelection = () => {
        if (selectedCustomerId) {
            onSelect(parseInt(selectedCustomerId));
        }
        handleClose();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    // Filter customers based on search term
    const filteredCustomers = customers.filter(customer => {
        const search = searchTerm.toLowerCase();
        return (
            customer.customer_name?.toLowerCase().includes(search) ||
            customer.email?.toLowerCase().includes(search) ||
            customer.contact_number?.includes(search) ||
            customer.customer_id?.toString().includes(search) ||
            customer.id?.toString().includes(search)
        );
    });

    return (
        <>
            <div className={`modal-backdrop fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${isClosing ? 'closing' : ''}`}>
                <div className={`modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col ${isClosing ? 'closing' : ''}`}>
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                                    <UserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Select Customer
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Choose a customer for this sale
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

                    {/* Search Bar */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Customer List */}
                    <div className="px-6 py-4 overflow-y-auto flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 dark:text-gray-400 mt-4">Loading customers...</p>
                                </div>
                            </div>
                        ) : filteredCustomers.length === 0 ? (
                            <div className="text-center py-12">
                                <UserCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {searchTerm ? 'No customers found' : 'No customers available'}
                                </h3>
                                <button
                                    onClick={()=> {setShowCreateCustomerModal(true)}}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Customer
                                    </>

                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredCustomers.map((customer) => {
                                    const customerId = customer.id || customer.customer_id;
                                    const isSelected = selectedCustomerId == customerId;

                                    return (
                                        <div
                                            key={customerId}
                                            onClick={() => setSelectedCustomerId(customerId)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        isSelected ? 'bg-blue-600' : 'bg-gradient-to-r from-green-500 to-blue-500'
                                                    }`}>
                                                        <span className="text-white font-medium text-sm">
                                                            {customer.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                {customer.customer_title ? `${customer.customer_title} ` : ''}
                                                                {customer.customer_name}
                                                            </h4>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                ID: {customerId}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 space-y-0.5">
                                                            {customer.email && (
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {customer.email}
                                                                </p>
                                                            )}
                                                            {customer.contact_number && (
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {customer.contact_number}
                                                                </p>
                                                            )}
                                                            {customer.customer_type && (
                                                                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                                                                    {customer.customer_type}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="ml-2">
                                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center space-x-2">
                            {selectedCustomerId && (
                                <button
                                    onClick={handleViewEditCustomer}
                                    disabled={loadingCustomer}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingCustomer ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            View/Edit Customer
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSelection}
                                disabled={!selectedCustomerId}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {selectedCustomerId == currentCustomerId ? 'Keep Current' : 'Select Customer'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Customer Modal */}
            {showEditModal && selectedCustomer && (
                <EditCustomerModal
                    customer={selectedCustomer}
                    onClose={handleCloseEditModal}
                />
            )}

            {showCreateCustomerModal && (
                <CreateCustomerModal
                    onClose={()=> {setShowCreateCustomerModal(false)}}
                />
            )}


        </>
    );
};

export default SelectCustomerModal;
