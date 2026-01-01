import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {Ship, Package, AlertCircle, Eye, Filter as FilterIcon, ShoppingCart, BanknoteIcon, Loader2, Star} from 'lucide-react';
import { vehicleService } from '../../../api/index.js';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectFilters,
    updateVehiclePurchase,
    fetchVehicleCounts,
    fetchMoreVehicles,
    resetInfiniteScroll,
    selectPurchaseCounts,
    selectHasMore,
    selectIsLoadingMore,
    selectInfiniteScrollPage
} from '../../../state/vehicleSlice.js';
import Notification from '../../common/Notification.jsx';
import SelectedCarCard from '../orderedCars/SelectedCarCard/SelectedCarCard.jsx';
import Filter from '../orderedCars/Filter.jsx';
import VehicleTrackerCard from "../../common/VehcleTrackerCard.jsx";
import LoadingOverlay from '../../common/LoadingOverlay.jsx';

const PURCHASE_STATUSES = [
    { id: 'LC_PENDING', label: 'LC Pending', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800' },
    { id: 'LC_OPENED', label: 'LC Opened', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800' },
    { id: 'LC_RECEIVED', label: 'LC Received', color: 'bg-purple-100 border-purple-300', textColor: 'text-purple-800' },
    { id: 'CANCELLED', label: 'Cancelled', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800' }
];

const PurchaseTracking = () => {
    const dispatch = useDispatch();
    const [columns, setColumns] = useState({});
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });
    const [selectedCar, setSelectedCar] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const containerRef = useRef(null);

    // Redux selectors
    const filters = useSelector(selectFilters);
    const purchaseCounts = useSelector(selectPurchaseCounts);
    const hasMore = useSelector(selectHasMore);
    const isLoadingMore = useSelector(selectIsLoadingMore);
    const currentPage = useSelector(selectInfiniteScrollPage);

    // Initial load and filter changes
    useEffect(() => {
        fetchInitialVehicles();
    }, [filters, featuredOnly]);

    const fetchInitialVehicles = async () => {
        try {
            setLoading(true);
            // Reset pagination
            dispatch(resetInfiniteScroll());

            // Prepare filters with featured flag
            const combinedFilters = {
                ...filters,
                ...(featuredOnly && { is_featured: true })
            };

            // Fetch counts first (pass all purchase status IDs)
            const statusIds = PURCHASE_STATUSES.map(s => s.id);
            await dispatch(fetchVehicleCounts({
                statusType: 'purchase',
                statuses: statusIds,
                filters: combinedFilters
            })).unwrap();

            // Fetch initial batch of 50 vehicles
            const response = await vehicleService.getAllVehicles({
                page: 1,
                limit: 50,
                filters: combinedFilters
            });

            // Group vehicles by purchase status
            const grouped = PURCHASE_STATUSES.reduce((acc, status) => {
                acc[status.id] = [];
                return acc;
            }, {});

            response.data.forEach(vehicle => {
                const status = vehicle.vehicle_purchase?.purchase_status || 'LC_PENDING';
                if (grouped[status]) {
                    grouped[status].push(vehicle);
                }
            });

            setColumns(grouped);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            showNotification('error', 'Error', 'Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    };

    // Load more vehicles for infinite scroll
    const loadMoreVehicles = useCallback(async () => {
        if (!hasMore || isLoadingMore) return;

        try {
            // Prepare filters with featured flag
            const combinedFilters = {
                ...filters,
                ...(featuredOnly && { is_featured: true })
            };

            const response = await dispatch(fetchMoreVehicles({
                page: currentPage + 1,
                limit: 50,
                filters: combinedFilters
            })).unwrap();

            // Group new vehicles and append to existing columns
            const newGrouped = { ...columns };
            response.vehicles.forEach(vehicle => {
                const status = vehicle.vehicle_purchase?.purchase_status || 'LC_PENDING';
                if (newGrouped[status]) {
                    newGrouped[status].push(vehicle);
                }
            });

            setColumns(newGrouped);
        } catch (error) {
            console.error('Error loading more vehicles:', error);
        }
    }, [hasMore, isLoadingMore, currentPage, filters, featuredOnly, columns, dispatch]);

    // Scroll detection for infinite scroll
    const handleScroll = useCallback((e) => {
        if (isLoadingMore || !hasMore) return;

        // Use event.currentTarget instead of containerRef since each column scrolls independently
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        // Load more when scrolled 80% of the content
        if (scrollPercentage > 0.8) {
            loadMoreVehicles();
        }
    }, [isLoadingMore, hasMore, loadMoreVehicles]);

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
    };

    const hideNotification = () => {
        setNotification({ show: false, type: '', title: '', message: '' });
    };

    const handleViewDetails = (vehicle) => {
        setSelectedCar(vehicle);
    };

    const closeModal = () => {
        setSelectedCar(null);
    };

    const onDragEnd = async (result) => {
        if (loading) return; // Prevent drag during loading

        const { source, destination } = result;

        // Dropped outside a valid droppable
        if (!destination) return;

        // Dropped in the same position
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = Array.from(sourceColumn);
        const destItems = source.droppableId === destination.droppableId ? sourceItems : Array.from(destColumn);

        // Remove from source
        const [removed] = sourceItems.splice(source.index, 1);

        // Add to destination
        destItems.splice(destination.index, 0, removed);

        // Update state optimistically
        const newColumns = {
            ...columns,
            [source.droppableId]: sourceItems,
            [destination.droppableId]: destItems
        };
        setColumns(newColumns);

        // Update backend
        try {
            await dispatch(updateVehiclePurchase({
                vehicleId: removed.vehicle.id,
                purchaseData: {
                    ...removed.vehicle_purchase,
                    purchase_status: destination.droppableId
                }
            })).unwrap();

            showNotification('success', 'Success', `Vehicle moved to ${PURCHASE_STATUSES.find(s => s.id === destination.droppableId)?.label}`);
        } catch (error) {
            // Revert on error
            setColumns(columns);
            showNotification('error', 'Error', 'Failed to update Purchase status: ' + error.message);
        }
    };

    return (
        <>
            <Notification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                isVisible={notification.show}
                onClose={hideNotification}
            />

            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <BanknoteIcon className="w-8 h-8 text-blue-600" />
                                Purchase Tracking
                            </h1>
                            <p className="text-gray-600 mt-1">Drag and drop vehicles to update purchase status</p>
                        </div>
                        <div className="flex items-center gap-2 relative">
                            <button
                                onClick={() => setFeaturedOnly(!featuredOnly)}
                                className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                                    featuredOnly
                                        ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Star className={`w-4 h-4 ${featuredOnly ? 'fill-yellow-500' : ''}`} />
                                Featured
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <FilterIcon className="w-4 h-4" />
                                Filters
                            </button>
                            <button
                                onClick={fetchInitialVehicles}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Refresh
                            </button>
                            {/* Filter Component */}
                            {showFilters && <Filter closeModal={() => setShowFilters(false)} />}
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="relative flex-1">
                    {loading && <LoadingOverlay message="Loading purchase data..." icon={BanknoteIcon} />}
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="overflow-x-auto pb-4" style={{ height: 'calc(100vh - 200px)' }}>
                            <div className="flex gap-4 h-full">
                                {PURCHASE_STATUSES.map(status => (
                                <div key={status.id} className="flex-shrink-0 w-80 flex flex-col h-full">
                                <div className={`rounded-lg ${status.color} border-2 p-3 mb-3`}>
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-semibold ${status.textColor}`}>
                                            {status.label} ({purchaseCounts[status.id] || 0})
                                        </h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.textColor} bg-white`}>
                                            {columns[status.id]?.length || 0}
                                        </span>
                                    </div>
                                </div>

                                <Droppable droppableId={status.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            onScroll={handleScroll}
                                            {...provided.droppableProps}
                                            className={`flex-1 overflow-y-auto rounded-lg p-2 transition-colors custom-scrollbar ${
                                                snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-50'
                                            }`}
                                        >
                                            {columns[status.id]?.length > 0 ? (
                                                columns[status.id].map((vehicle, index) => (
                                                    <VehicleTrackerCard key={vehicle.vehicle.id} vehicle={vehicle} index={index} handleViewDetails={() =>handleViewDetails(vehicle)} />
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                                                    <AlertCircle className="w-8 h-8 mb-2" />
                                                    <p className="text-sm">No vehicles</p>
                                                </div>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                </div>
                                ))}
                            </div>
                        </div>
                    </DragDropContext>

                    {/* Loading More Indicator */}
                    {isLoadingMore && (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-2" />
                            <span className="text-sm text-gray-600">Loading more vehicles...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Vehicle Details Modal */}
            {selectedCar && (
                <SelectedCarCard
                    id={selectedCar.vehicle.id}
                    closeModal={closeModal}
                    onSave={(updatedData) => {
                        fetchInitialVehicles();
                    }}
                />
            )}
        </>
    );
};

export default PurchaseTracking;
