import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Grid, List, Building2 } from 'lucide-react';
import {
    fetchSuppliers,
    selectSuppliers,
    selectLoading,
    selectCurrentPage,
    selectTotalPages,
    selectPageLimit,
    selectTotalSuppliers,
    setCurrentPage,
    setPageLimit
} from '../../../state/supplierSlice';
import { selectPermissions } from '../../../state/authSlice';
import { hasPermission } from '../../../utils/permissionUtils';
import { PERMISSIONS } from '../../../utils/permissions';
import SupplierCard from './SupplierCard';
import CreateSupplier from './CreateSupplier';
import ViewSupplierModal from './ViewSupplierModal';

const Suppliers = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const suppliers = useSelector(selectSuppliers);
    const loading = useSelector(selectLoading);
    const currentPage = useSelector(selectCurrentPage);
    const totalPages = useSelector(selectTotalPages);
    const pageLimit = useSelector(selectPageLimit);
    const totalSuppliers = useSelector(selectTotalSuppliers);
    const permissions = useSelector(selectPermissions);

    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [viewingSupplier, setViewingSupplier] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('supplierViewMode')) {
            setViewMode(localStorage.getItem('supplierViewMode'));
        }
        dispatch(fetchSuppliers({ page: currentPage, limit: pageLimit, search: searchQuery }));
    }, [dispatch, currentPage, pageLimit, searchQuery]);

    // Check if navigated with selected supplier from search
    useEffect(() => {
        if (location.state?.selectedSupplier) {
            setViewingSupplier(location.state.selectedSupplier);
            // Clear the state to prevent reopening on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const toggleViewMode = (mode) => {
        setViewMode(mode);
        localStorage.setItem('supplierViewMode', mode);
    };

    const handlePageChange = (pageNumber) => {
        dispatch(setCurrentPage(pageNumber));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageLimitChange = (newLimit) => {
        dispatch(setPageLimit(Number(newLimit)));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        dispatch(setCurrentPage(1));
    };

    const handleCreateSupplier = () => {
        setSelectedSupplier(null);
        setShowCreateModal(true);
    };

    const handleEditSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        setShowCreateModal(true);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setSelectedSupplier(null);
    };

    const handleSupplierSaved = () => {
        dispatch(fetchSuppliers({ page: currentPage, limit: pageLimit, search: searchQuery }));
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Suppliers Management</h1>
                    <p className="text-gray-600 mt-2">
                        Manage auction houses, dealers, and other vehicle suppliers
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => toggleViewMode('grid')}
                            className={`p-2 rounded transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                            title="Grid View"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => toggleViewMode('list')}
                            className={`p-2 rounded transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add Supplier Button */}
                    {hasPermission(permissions, PERMISSIONS.SUPPLIER_CREATE) && (
                        <button
                            onClick={handleCreateSupplier}
                            className="px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                            style={{
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Add Supplier
                        </button>
                    )}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search suppliers by name, email, or location..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Items per page */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show:</span>
                        <select
                            value={pageLimit}
                            onChange={(e) => handlePageLimitChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                            <option value="96">96</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Empty State */}
            {!loading && suppliers.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first supplier'}
                    </p>
                    {!searchQuery && hasPermission(permissions, PERMISSIONS.SUPPLIER_CREATE) && (
                        <button
                            onClick={handleCreateSupplier}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 inline mr-2" />
                            Add Supplier
                        </button>
                    )}
                </div>
            )}

            {/* Suppliers Grid/List */}
            {!loading && suppliers.length > 0 && (
                <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                    {suppliers.map((supplier) => (
                        <SupplierCard
                            key={supplier.id}
                            supplier={supplier}
                            viewMode={viewMode}
                            onEdit={handleEditSupplier}
                            onView={setViewingSupplier}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * pageLimit) + 1} to {Math.min(currentPage * pageLimit, totalSuppliers)} of {totalSuppliers} suppliers
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-4 py-2 rounded-lg ${
                                            currentPage === pageNumber
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                            ) {
                                return <span key={pageNumber} className="px-2">...</span>;
                            }
                            return null;
                        })}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Supplier Modal */}
            {showCreateModal && (
                <CreateSupplier
                    supplier={selectedSupplier}
                    onClose={handleCloseModal}
                    onSaved={handleSupplierSaved}
                />
            )}

            {/* View Supplier Modal */}
            {viewingSupplier && (
                <ViewSupplierModal
                    supplier={viewingSupplier}
                    onClose={() => setViewingSupplier(null)}
                />
            )}
        </div>
    );
};

export default Suppliers;
