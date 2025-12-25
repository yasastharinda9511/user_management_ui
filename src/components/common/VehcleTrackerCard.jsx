import {Draggable} from "@hello-pangea/dnd";
import {Eye, Package} from "lucide-react";

const VehicleTrackerCard = ({ vehicle, index, handleViewDetails }) => {
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

export default VehicleTrackerCard;