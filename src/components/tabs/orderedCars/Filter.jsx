import {useDispatch, useSelector} from "react-redux";
import {applyFilters, clearFilters, selectFilters, setCurrentPage, setFilters} from "../../../state/vehicleSlice.js";
import React, {useEffect, useState} from "react";
import {X, Search, Car, ChevronLeft} from 'lucide-react';
import PreviewCard from "./PreviewCard.jsx";


const Filter = ({closeModal}) => {
    const dispatch = useDispatch();
    const appliedFilters = useSelector(selectFilters);

    const [pendingFilters, setPendingFilters] = useState(appliedFilters);
    const [hasChanges, setHasChanges] = useState(false);

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

    const filterOptions = {
        make: ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Suzuki', 'BMW', 'Mercedes', 'Audi'],
        models: ['Aqua', 'Prius', 'Vitz', 'Axio', 'Fielder', 'Allion', 'Fit', 'Vezel', 'Grace', 'Freed'],
        years: Array.from({length: 15}, (_, i) => (new Date().getFullYear() - i).toString()),
        statuses: ['Available', 'Shipped', 'In Transit', 'Arrived', 'Clearing', 'Ready for Delivery', 'Delivered'],
        colors: ['Pearl White', 'Silver', 'Black', 'Blue', 'Red', 'Gray', 'White', 'Dark Blue'],
        transmissions: ['Automatic', 'Manual', 'CVT'],
        fuelTypes: ['Petrol', 'Hybrid', 'Diesel', 'Electric']
    };

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
        <div className="bg-white p-6 rounded-lg shadow-lg border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Search */}
                <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by make, model, or VIN..."
                            value={pendingFilters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <select
                        value={pendingFilters.make}
                        onChange={(e) => handleFilterChange('make', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Brands</option>
                        {filterOptions.make.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                {/* Model */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <select
                        value={pendingFilters.model}
                        onChange={(e) => handleFilterChange('model', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Models</option>
                        {filterOptions.models.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>

                {/* Year */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select
                        value={pendingFilters.year}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Years</option>
                        {filterOptions.years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={pendingFilters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        {filterOptions.statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (LKR)</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={pendingFilters.priceRangeMin}
                            onChange={(e) => handleFilterChange('priceRangeMin', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={pendingFilters.priceRangeMax}
                            onChange={(e) => handleFilterChange('priceRangeMax', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Date Range */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="date"
                            value={pendingFilters.dateRangeStart}
                            onChange={(e) => handleFilterChange('dateRangeStart', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="date"
                            value={pendingFilters.dateRangeEnd}
                            onChange={(e) => handleFilterChange('dateRangeEnd', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Color */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                        value={pendingFilters.color}
                        onChange={(e) => handleFilterChange('color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Colors</option>
                        {filterOptions.colors.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>

                {/* Transmission */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                    <select
                        value={pendingFilters.transmission}
                        onChange={(e) => handleFilterChange('transmission', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        {filterOptions.transmissions.map(transmission => (
                            <option key={transmission} value={transmission}>{transmission}</option>
                        ))}
                    </select>
                </div>

                {/* Fuel Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <select
                        value={pendingFilters.fuelType}
                        onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        {filterOptions.fuelTypes.map(fuelType => (
                            <option key={fuelType} value={fuelType}>{fuelType}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                    onClick={handleApplyFilters}
                    disabled={!hasChanges && !hasPendingActiveFilters}
                    className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                        hasChanges || hasPendingActiveFilters
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {hasChanges ? 'Apply Filters' : 'Apply'}
                </button>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 p-4 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                        {Object.entries(pendingFilters).map(([key, value]) => {
                            if (typeof value === 'string' && value) {
                                return (
                                    <span
                                        key={key}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                    >
                                    {key}: {value}
                                        <button
                                            onClick={() => handleFilterChange(key, '')}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                                );
                            }
                        })}
                        <button
                            onClick={handlerClearFilters}
                            className="text-sm text-red-600 hover:text-red-800 font-medium ml-2"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Filter;