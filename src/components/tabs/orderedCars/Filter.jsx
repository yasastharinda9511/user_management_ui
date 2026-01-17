import {useDispatch, useSelector} from "react-redux";
import {
    applyFilters,
    selectFilters,
    setCurrentPage,
    fetchAllOptions,
    selectFilterOptions,
    selectLoadingOptions
} from "../../../state/vehicleSlice.js";
import React, {useEffect, useState, useRef} from "react";
import {X, Search, Car, ChevronLeft} from 'lucide-react';
import {selectSuppliers, selectLoading, fetchSuppliers} from "../../../state/supplierSlice.js";


const Filter = ({closeModal}) => {
    const dispatch = useDispatch();
    const appliedFilters = useSelector(selectFilters);
    const filterOptions = useSelector(selectFilterOptions);
    const loadingOptions = useSelector(selectLoadingOptions);
    const loadingSuppliers = useSelector(selectLoading);
    const suppliers = useSelector(selectSuppliers);
    const filterRef = useRef(null);

    const [pendingFilters, setPendingFilters] = useState(appliedFilters);
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch filter options on mount
    useEffect(() => {
        dispatch(fetchAllOptions());
        dispatch(fetchSuppliers({ page :1, limit : 100, search :'' }));
    }, [dispatch]);

    // Handle ESC key to close filter and Enter key to apply filters
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'Enter') {
                // Apply filters when Enter is pressed
                const hasPendingActiveFilters = Object.values(pendingFilters).some(value => {
                    return value && value.toString().trim() !== '';
                });

                if (hasChanges || hasPendingActiveFilters) {
                    dispatch(applyFilters(pendingFilters));
                    dispatch(setCurrentPage(1));
                    setHasChanges(false);
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeModal, hasChanges, pendingFilters, dispatch]);

    // Handle click outside to close filter
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                closeModal();
            }
        };
        // Add slight delay to prevent immediate closing on button click
        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeModal]);

    const hasPendingActiveFilters = Object.values(pendingFilters).some(value => {
        return value && value.toString().trim() !== '';
    });

    const handleFilterChange = (filterKey, value) => {
        setPendingFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));

        // Check if this creates a change from applied filters
        setHasChanges(true);
    };

    const hasActiveFilters = Object.values(pendingFilters).some(value => {
        return value && value.toString().trim() !== '';
    });

    const handleApplyFilters = () => {
        dispatch(applyFilters(pendingFilters));
        dispatch(setCurrentPage(1));
        setHasChanges(false);
    };

    const handlerClearFilters = () => {
        const clearedFilters = Object.fromEntries(
            Object.keys(pendingFilters).map(key => [key, ''])
        );
        setPendingFilters(clearedFilters);
        setHasChanges(true);

    }
    return(
        <div ref={filterRef} className="absolute right-0 top-full mt-2 w-[60vw] max-w-4xl z-50">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto backdrop-blur-sm" style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
            }}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Filter Options</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:rotate-90 duration-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by make, model, or VIN..."
                                value={pendingFilters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                            Vehicle Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                                <select
                                    value={pendingFilters.make}
                                    onChange={(e) => handleFilterChange('make', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Brands</option>
                                    {loadingOptions ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        Object.keys(filterOptions.makes_models || {}).map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                                <select
                                    value={pendingFilters.model}
                                    onChange={(e) => handleFilterChange('model', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Models</option>
                                    {loadingOptions ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        filterOptions.makes_models[pendingFilters['make']]?.map(model => (
                                            <option key={model} value={model}>{model}</option>
                                        ))
                                    )}
                                </select>
                            </div>


                            {/* Transmission */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transmission</label>
                                <select
                                    value={pendingFilters.transmission}
                                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {loadingOptions ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        filterOptions.transmission_types?.map(transmission => (
                                            <option key={transmission} value={transmission}>{transmission}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Type</label>
                                <select
                                    value={pendingFilters.fuelType}
                                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {loadingOptions ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        filterOptions.fuel_types?.map(fuelType => (
                                            <option key={fuelType} value={fuelType}>{fuelType}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Shipping Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Status</label>
                                <select
                                    value={pendingFilters.shipping_status}
                                    onChange={(e) => handleFilterChange('shipping_status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    {loadingOptions ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        filterOptions.shipping_statuses?.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Sale Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sale Status</label>
                                <select
                                    value={pendingFilters.sale_status}
                                    onChange={(e) => handleFilterChange('sale_status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    {loadingOptions ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        filterOptions.sale_statuses?.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Purchase Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Status</label>
                                <select
                                    value={pendingFilters.purchase_status}
                                    onChange={(e) => handleFilterChange('purchase_status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    {loadingOptions ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        filterOptions.purchase_statuses?.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Suppliers */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label>
                                <select
                                    value={pendingFilters.supplier_id}
                                    onChange={(e) => handleFilterChange('supplier_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Suppliers</option>
                                    {loadingSuppliers ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        suppliers?.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>{supplier.supplier_name}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* Year & Color */}
                    <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-full"></span>
                            Year & Color
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                                <select
                                    value={pendingFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Years</option>
                                    {filterOptions.years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                                <select
                                    value={pendingFilters.color}
                                    onChange={(e) => handleFilterChange('color', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Colors</option>
                                    {filterOptions.colors.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Price and Date Range */}
                    <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></span>
                            Price & Date Range
                        </h4>
                        <div className="space-y-4">
                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range (LKR)</label>
                                <div className="flex items-center space-x-2 max-w-md">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={pendingFilters.priceRangeMin}
                                        onChange={(e) => handleFilterChange('priceRangeMin', e.target.value)}
                                        className="flex-1 max-w-40 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-500 dark:text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={pendingFilters.priceRangeMax}
                                        onChange={(e) => handleFilterChange('priceRangeMax', e.target.value)}
                                        className="flex-1 max-w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="date"
                                        value={pendingFilters.dateRangeStart}
                                        onChange={(e) => handleFilterChange('dateRangeStart', e.target.value)}
                                        className="flex-1 px-3 max-w-40 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-500 dark:text-gray-400">-</span>
                                    <input
                                        type="date"
                                        value={pendingFilters.dateRangeEnd}
                                        onChange={(e) => handleFilterChange('dateRangeEnd', e.target.value)}
                                        className="flex-1 max-w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sorting */}
                    <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></span>
                            Sorting
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Order By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                                <select
                                    value={pendingFilters.order_by || 'id'}
                                    onChange={(e) => handleFilterChange('order_by', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="id">ID</option>
                                    <option value="make">Make</option>
                                    <option value="model">Model</option>
                                    <option value="year">Year</option>
                                    <option value="price">Price</option>
                                    <option value="created_at">Created Date</option>
                                    <option value="updated_at">Updated Date</option>
                                    <option value="shipping_status">Shipping Status</option>
                                    <option value="sale_status">Sale Status</option>
                                </select>
                            </div>

                            {/* Sort Direction */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
                                <select
                                    value={pendingFilters.sort || 'ASC'}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ASC">Ascending (A-Z, 0-9)</option>
                                    <option value="DESC">Descending (Z-A, 9-0)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleApplyFilters}
                            disabled={!hasChanges && !hasPendingActiveFilters}
                            className={`px-8 py-3 text-sm font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                                hasChanges || hasPendingActiveFilters
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-blue-500/50'
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-gray-300/50'
                            }`}
                            style={{
                                boxShadow: hasChanges || hasPendingActiveFilters
                                    ? '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.05)'
                                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {hasChanges ? 'Apply Filters' : 'Apply'}
                        </button>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 ">
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-inner border border-blue-100 dark:border-blue-800">
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Active Filters:</span>
                            {Object.entries(pendingFilters).map(([key, value]) => {
                                if (typeof value === 'string' && value) {
                                    return (
                                        <span
                                            key={key}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                                        >
                                        {key}: {value}
                                            <button
                                                onClick={() => handleFilterChange(key, '')}
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                            >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                    );
                                }
                            })}
                            <button
                                onClick={handlerClearFilters}
                                className="text-sm text-white font-bold ml-2 px-5 py-2 rounded-full transition-all transform hover:scale-105 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                </div>
        </div>
    )
}

export default Filter;