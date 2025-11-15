import React, {useEffect, useState} from 'react';
import { Car, ChevronLeft, ChevronRight, Plus, Grid, List } from 'lucide-react';
import CreateVehicle from "./CreateVehicle.jsx";
import SelectedCarCard from "./SelectedCarCard.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchVehicles,
    fetchVehicleById,
    setCurrentPage,
    setPageLimit,
    selectVehicles,
    selectLoading,
    selectError,
    selectCurrentPage,
    selectTotalPages,
    selectTotalVehicles,
    selectPageLimit,
    clearSelectedVehicle,
    selectSelectedVehicle,
    selectShouldRefresh,
    selectFilters,
} from '../../../state/vehicleSlice.js';
import PreviewCard from "./PreviewCard.jsx";
import Filter from "./Filter.jsx";
import {selectPermissions} from "../../../state/authSlice.js";
import {PERMISSIONS} from "../../../utils/permissions.js";
import {hasPermission} from "../../../utils/permissionUtils.js";

const OrderedCars = () => {
    const dispatch = useDispatch();
    const [selectedCar, setSelectedCar] = useState(null);
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const filters = useSelector(selectFilters);
    const pageLimit = useSelector(selectPageLimit);
    const permissions = useSelector(selectPermissions);

    const shouldRefresh = useSelector(selectShouldRefresh);

    const toggleViewMode = (viewMode)=>{
        setViewMode(viewMode);
        localStorage.setItem("viewMode", viewMode);
    }


    const {
        vehicles,
        loading,
        error,
        currentPage,
        totalPages,
        totalVehicles,
        selectedVehicle,
    } = useSelector(state => state.vehicles);

    useEffect(() => {
        if (localStorage.getItem("viewMode")){
            setViewMode(localStorage.getItem("viewMode"));
        }
        dispatch(fetchVehicles({
            page: currentPage,
            limit: pageLimit,
            filters: filters // Pass filters to API
        }))
    }, [dispatch, currentPage, pageLimit, filters]); // Added pageLimit to dependency array

    useEffect(() => {
        if (shouldRefresh) {
            dispatch(fetchVehicles({
                page: currentPage,
                limit: pageLimit,
                filters: filters
            }))
        }
    }, [shouldRefresh]);

    const handleOrderSubmit = (orderData) => {
        console.log('Order received:', orderData);
        alert(`Order ${orderData.isDraft ? 'saved as draft' : 'placed'} successfully!\nOrder Number: ${orderData.orderNumber}`);
    };

    // Filter handlers
    const handleFilterChange = (filterKey, value) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
        // Reset to first page when filters change
        dispatch(setCurrentPage(1));
    };

    const handlePriceRangeChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: value
            }
        }));
        dispatch(setCurrentPage(1));
    };

    const handleDateRangeChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [type]: value
            }
        }));
        dispatch(setCurrentPage(1));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            brand: '',
            model: '',
            year: '',
            status: '',
            priceRange: { min: '', max: '' },
            dateRange: { start: '', end: '' },
            color: '',
            transmission: '',
            fuelType: ''
        });
        dispatch(setCurrentPage(1));
    };

    const hasActiveFilters = Object.values(filters).some(value => {
        if (typeof value === 'string') return value !== '';
        if (typeof value === 'object') return Object.values(value).some(v => v !== '');
        return false;
    });

    const indexOfLastCar = currentPage * pageLimit;
    const indexOfFirstCar = indexOfLastCar - pageLimit;

    const handlePageChange = (pageNumber) => {
        dispatch(setCurrentPage(pageNumber));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewDetails = (car) => {
        setSelectedCar(car);
    };

    const closeModal = () => {
        setSelectedCar(null);
    };

    const closeFilterModal = ()=>{
        setShowFilters(false);
    }

    const handleCreateOrder = () => {
        setShowCreateOrder(true);
    };

    const closeCreateOrder = () => {
        setShowCreateOrder(false);
    };

    const handlePageLimitChange = (newLimit) => {
        dispatch(setPageLimit(Number(newLimit)));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Car Deals Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Track imported car orders from Japan - Shipping, clearing, and sales management
                    </p>
                </div>
                <div className="flex items-center gap-4 relative">

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

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                            showFilters || hasActiveFilters
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold">
                                Active
                            </span>
                        )}
                    </button>
                    {hasPermission(permissions,PERMISSIONS.CAR_CREATE) && <button
                        onClick={handleCreateOrder}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Car</span>
                    </button>}

                    {/* Filters Panel - Positioned relative to button container */}
                    {showFilters && <Filter closeModal={closeFilterModal}></Filter>}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading vehicles...</p>
                    </div>
                </div>
            )}

            {/* No Results */}
            {!loading && vehicles.length === 0 && (
                <div className="text-center py-12">
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                    <p className="text-gray-600 mb-4">
                        {hasActiveFilters
                            ? 'Try adjusting your filters to see more results.'
                            : 'No vehicles available at the moment.'
                        }
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            {/* Cars Display - Grid or List */}
            {!loading && vehicles.length > 0 && (
                <>
                    {/* Grid View */}
                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {vehicles.map((car) => (
                                <PreviewCard car={car} key={car.id} handleViewDetails={handleViewDetails} />
                            ))}
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === 'list' && (
                        <div className="space-y-4">
                            {vehicles.map((car) => (
                                <PreviewCard car={car} key={car.id} handleViewDetails={handleViewDetails} viewMode="list" />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Pagination */}
            {!loading && vehicles.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        {/* Spacer for left side to center pagination */}
                        <div className="w-48"></div>

                        {/* Pagination Controls - Centered */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                        {(() => {
                            const pageNumbers = [];
                            const maxVisiblePages = 5;
                            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                            if (endPage - startPage + 1 < maxVisiblePages) {
                                startPage = Math.max(1, endPage - maxVisiblePages + 1);
                            }

                            if (startPage > 1) {
                                pageNumbers.push(
                                    <button
                                        key={1}
                                        onClick={() => handlePageChange(1)}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        1
                                    </button>
                                );
                                if (startPage > 2) {
                                    pageNumbers.push(
                                        <span key="start-ellipsis" className="px-2 text-gray-500">...</span>
                                    );
                                }
                            }

                            for (let i = startPage; i <= endPage; i++) {
                                pageNumbers.push(
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            currentPage === i
                                                ? 'bg-blue-600 text-white border border-blue-600'
                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {i}
                                    </button>
                                );
                            }

                            if (endPage < totalPages) {
                                if (endPage < totalPages - 1) {
                                    pageNumbers.push(
                                        <span key="end-ellipsis" className="px-2 text-gray-500">...</span>
                                    );
                                }
                                pageNumbers.push(
                                    <button
                                        key={totalPages}
                                        onClick={() => handlePageChange(totalPages)}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        {totalPages}
                                    </button>
                                );
                            }

                            return pageNumbers;
                        })()}
                    </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        )}

                        {/* Items per page selector - Right side */}
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
                                <option value="6">6</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="12">12</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for detailed view */}
            {selectedCar && <SelectedCarCard selectedCar={selectedCar} closeModal={closeModal} />}

            {/* Create New Order Modal */}
            {showCreateOrder && (
                <CreateVehicle
                    isOpen={showCreateOrder}
                    onClose={closeCreateOrder}
                    onSubmit={handleOrderSubmit}
                />
            )}
        </div>
    );
};

export default OrderedCars;