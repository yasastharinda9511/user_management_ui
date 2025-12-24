import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {Ship, Package, AlertCircle, Eye, Filter as FilterIcon, ShoppingCart, BanknoteIcon} from 'lucide-react';
import { vehicleService } from '../../../api/index.js';
import { useDispatch, useSelector } from 'react-redux';
import {updateVehicleShipping, selectFilters, updateVehiclePurchase} from '../../../state/vehicleSlice.js';
import Notification from '../../common/Notification.jsx';
import SelectedCarCard from '../orderedCars/SelectedCarCard.jsx';
import Filter from '../orderedCars/Filter.jsx';

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
    const filters = useSelector(selectFilters);

    useEffect(() => {
        fetchVehicles();
    }, [filters]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await vehicleService.getAllVehicles({
                page: 1,
                limit: 1000,
                filters: filters
            });

            // Group vehicles by shipping status
            const grouped = PURCHASE_STATUSES.reduce((acc, status) => {
                acc[status.id] = [];
                return acc;
            }, {});

            response.data.forEach(vehicle => {
                const status = vehicle.vehicle_purchase?.purchase_status || 'LC_PROCESSING';
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

    const VehicleCard = ({ vehicle, index }) => {
        return (
            <Draggable draggableId={`vehicle-${vehicle.vehicle.id}`} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''
                        }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                    {vehicle.vehicle.make} {vehicle.vehicle.model}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {vehicle.vehicle.year_of_manufacture} • {vehicle.vehicle.color}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(vehicle);
                                    }}
                                    className="p-1 hover:bg-blue-50 rounded transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-4 h-4 text-blue-600" />
                                </button>
                                <Package className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Chassis:</span>
                                <span className="font-mono">{vehicle.vehicle.chassis_id}</span>
                            </div>
                            {vehicle.vehicle_shipping?.vessel_name && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Vessel:</span>
                                    <span>{vehicle.vehicle_shipping.vessel_name}</span>
                                </div>
                            )}
                            {vehicle.vehicle_shipping?.departure_harbour && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">From:</span>
                                    <span>{vehicle.vehicle_shipping.departure_harbour}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Draggable>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Ship className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-bounce" />
                    <p className="text-gray-600">Loading shipping data...</p>
                </div>
            </div>
        );
    }

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
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <FilterIcon className="w-4 h-4" />
                                Filters
                            </button>
                            <button
                                onClick={fetchVehicles}
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
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
                        {PURCHASE_STATUSES.map(status => (
                            <div key={status.id} className="flex-shrink-0 w-80">
                                <div className={`rounded-lg ${status.color} border-2 p-3 mb-3`}>
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-semibold ${status.textColor}`}>
                                            {status.label}
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
                                            {...provided.droppableProps}
                                            className={`min-h-[500px] rounded-lg p-2 transition-colors ${
                                                snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-50'
                                            }`}
                                        >
                                            {columns[status.id]?.length > 0 ? (
                                                columns[status.id].map((vehicle, index) => (
                                                    <VehicleCard key={vehicle.vehicle.id} vehicle={vehicle} index={index} />
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
                </DragDropContext>
            </div>

            {/* Vehicle Details Modal */}
            {selectedCar && (
                <SelectedCarCard
                    id={selectedCar.vehicle.id}
                    closeModal={closeModal}
                    onSave={(updatedData) => {
                        // Optionally refresh the data after saving
                        fetchVehicles();
                    }}
                />
            )}
        </>
    );
};

export default PurchaseTracking;
