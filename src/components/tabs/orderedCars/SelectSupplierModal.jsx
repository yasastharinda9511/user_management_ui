import React, { useState, useEffect } from 'react';
import { X, Search, Building2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchSuppliers,
    selectSuppliers,
    selectLoading
} from '../../../state/supplierSlice.js';

const SelectSupplierModal = ({ currentSupplierId, onSelect, onClose }) => {
    const dispatch = useDispatch();
    const suppliers = useSelector(selectSuppliers);
    const loading = useSelector(selectLoading);

    const [selectedSupplierId, setSelectedSupplierId] = useState(currentSupplierId || '');
    const [isClosing, setIsClosing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchSuppliers());
    }, [dispatch]);

    const handleConfirmSelection = () => {
        if (selectedSupplierId) {
            onSelect(parseInt(selectedSupplierId));
        }
        onClose();
    };

    // Filter suppliers based on search term
    const filteredSuppliers = suppliers.filter(supplier => {
        const search = searchTerm.toLowerCase();
        return (
            supplier.supplier_name?.toLowerCase().includes(search) ||
            supplier.email?.toLowerCase().includes(search) ||
            supplier.contact_number?.includes(search) ||
            supplier.country?.toLowerCase().includes(search) ||
            supplier.supplier_id?.toString().includes(search) ||
            supplier.id?.toString().includes(search)
        );
    });

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    return (
        <>
            <div className={`modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${isClosing ? 'closing' : ''}`}>
                <div className={`modal-content bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col ${isClosing ? 'closing' : ''}`}>
                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Select Supplier
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Choose a supplier for this purchase
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

                    {/* Search Bar */}
                    <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, country, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Supplier List */}
                    <div className="px-6 py-4 overflow-y-auto flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-4">Loading suppliers...</p>
                                </div>
                            </div>
                        ) : filteredSuppliers.length === 0 ? (
                            <div className="text-center py-12">
                                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'No suppliers found' : 'No suppliers available'}
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm ? 'Try adjusting your search criteria.' : 'Add suppliers first.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredSuppliers.map((supplier) => {
                                    const supplierId = supplier.id || supplier.supplier_id;
                                    const isSelected = selectedSupplierId == supplierId;

                                    return (
                                        <div
                                            key={supplierId}
                                            onClick={() => setSelectedSupplierId(supplierId)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        isSelected ? 'bg-green-600' : 'bg-gradient-to-r from-green-500 to-teal-500'
                                                    }`}>
                                                        <span className="text-white font-medium text-sm">
                                                            {supplier.supplier_name?.charAt(0)?.toUpperCase() || 'S'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <h4 className="text-sm font-semibold text-gray-900">
                                                                {supplier.supplier_name}
                                                            </h4>
                                                            <span className="text-xs text-gray-500">
                                                                ID: {supplierId}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 space-y-0.5">
                                                            {supplier.email && (
                                                                <p className="text-xs text-gray-600">
                                                                    {supplier.email}
                                                                </p>
                                                            )}
                                                            {supplier.contact_number && (
                                                                <p className="text-xs text-gray-600">
                                                                    {supplier.contact_number}
                                                                </p>
                                                            )}
                                                            {supplier.country && (
                                                                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                                                    {supplier.country}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="ml-2">
                                                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
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
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleClose}
                                className={`modal-content px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${isClosing ? 'closing' : ''}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSelection}
                                disabled={!selectedSupplierId}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {selectedSupplierId == currentSupplierId ? 'Keep Current' : 'Select Supplier'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SelectSupplierModal;
