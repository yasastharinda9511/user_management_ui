import React, { useState, useEffect } from 'react';
import {Draggable} from "@hello-pangea/dnd";
import {Eye, Package, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Car} from "lucide-react";
import presignedUrlCache from '../../utils/presignedUrlCache.js';

const VehicleTrackerCard = ({ vehicle, index, handleViewDetails }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadingImages, setLoadingImages] = useState(false);

    useEffect(() => {
        if (isExpanded && imageUrls.length === 0) {
            fetchImageUrls();
        }
    }, [isExpanded]);

    const fetchImageUrls = async () => {
        if (!vehicle.vehicle_image || vehicle.vehicle_image.length === 0) {
            setImageUrls([]);
            return;
        }

        setLoadingImages(true);
        const sortedImages = [...vehicle.vehicle_image].sort((a, b) =>
            +a.display_order - +b.display_order
        );

        try {
            const urlPromises = sortedImages.map(async (image) => {
                return await presignedUrlCache.getCachedVehicleImage(image.vehicle_id, image.filename);
            });

            const urls = await Promise.all(urlPromises);
            setImageUrls(urls);
            setCurrentImageIndex(0);
        } catch (error) {
            console.error('Error fetching image URLs:', error);
            setImageUrls([]);
        } finally {
            setLoadingImages(false);
        }
    };

    const handlePreviousImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    };

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
                                    setIsExpanded(!isExpanded);
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title={isExpanded ? "Hide Photos" : "Show Photos"}
                            >
                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-600" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                )}
                            </button>
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

                    {/* Expanded Photos Section */}
                    {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            {loadingImages ? (
                                <div className="flex items-center justify-center h-32 bg-gray-50 rounded">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                        <p className="text-xs text-gray-500">Loading photos...</p>
                                    </div>
                                </div>
                            ) : imageUrls.length > 0 ? (
                                <div className="relative group">
                                    <img
                                        src={imageUrls[currentImageIndex]}
                                        alt={`${vehicle.vehicle.make} ${vehicle.vehicle.model}`}
                                        className="w-full h-40 object-cover rounded"
                                    />
                                    {/* Navigation Arrows */}
                                    {imageUrls.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePreviousImage}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <ChevronLeft className="w-4 h-4 text-gray-700" />
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <ChevronRight className="w-4 h-4 text-gray-700" />
                                            </button>
                                            {/* Image counter */}
                                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full">
                                                {currentImageIndex + 1} / {imageUrls.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded">
                                    <Car className="w-8 h-8 text-gray-300 mb-2" />
                                    <p className="text-xs text-gray-500">No photos available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default VehicleTrackerCard;