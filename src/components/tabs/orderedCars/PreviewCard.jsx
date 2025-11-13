import React, { useState, useEffect } from "react";
import { Car, Truck, Package, Eye, MapPin, Ship} from 'lucide-react';
import {getStatusColor} from "../../common/CommonLogics.js";
import config from "../../../configs/config.json";
import AuthImage from "../../common/AuthImage.jsx";
import {carServiceApi, vehicleService} from "../../../api/index.js";

const PreviewCard= ({car , handleViewDetails, viewMode = 'grid'})=>{
    const [imageUrl, setImageUrl] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchImageUrl = async () => {
            if (!car.vehicle_image || car.vehicle_image.length === 0) {
                setImageUrl(null);
                return;
            }

            const sortedImages = [...car.vehicle_image].sort((a, b) =>
                +a.display_order - +b.display_order
            );

            if(sortedImages.length > 0){
                try {
                    const response = await vehicleService.getVehicleImagePresignedUrl(sortedImages[0].filename);
                    console.log(response.data.presigned_url);
                    setImageUrl(response.data.presigned_url);
                } catch (error) {
                    console.error('Error fetching image URL:', error);
                    setImageUrl(null);
                }
            }
        };

        fetchImageUrl();
    }, [car.vehicle_image]);

    // List View Layout
    if (viewMode === 'list') {
        return (
            <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                    {/* Car Image */}
                    <div className="md:w-64 h-48 md:h-auto bg-gray-200 overflow-hidden flex-shrink-0">
                        <img
                            src={imageUrl}
                            alt={`${car.vehicle.make} ${car.vehicle.model}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row justify-between h-full">
                            <div className="flex-1">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{car.vehicle.make}</h3>
                                        <p className="text-sm text-gray-600">{car.vehicle.year_of_manufacture} • {car.vehicle.color} • {car.vehicle.trimLevel}</p>
                                        <p className="text-xs text-gray-500">Grade: {car.vehicle.auction_grade} • {car.vehicle.mileage_km} km</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(car.vehicle_shipping.shipping_status)}`}>
                                        {car.vehicle_shipping.shipping_status}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center text-sm">
                                        <Package className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">vehicleID:</span>
                                        <span className="font-medium text-gray-900">{car.vehicle.id}</span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Car className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">Chassis:</span>
                                        <span className="font-mono text-xs text-gray-900">{car.vehicle.chassis_id}</span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Ship className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">Shipped:</span>
                                        <span className="text-gray-900">{formatDate(car.vehicle.created_at)}</span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">Location:</span>
                                        <span className="text-gray-900">{car.vehicle_shipping.departure_harbour}</span>
                                    </div>

                                    {car.vehicle_shipping && (
                                        <div className="flex items-center text-sm">
                                            <Truck className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                            <span className="text-gray-600 min-w-[80px]">Vessel:</span>
                                            <span className="text-gray-900 text-xs">{car.vehicle_shipping.vessel_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex md:flex-col justify-between md:justify-start items-end md:items-end md:ml-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                                <div className="text-sm mb-4">
                                    <div className="text-lg font-bold text-blue-600">{car.vehicle.price}</div>
                                    {car.profit !== 'N/A' && (
                                        <div className="text-xs text-green-600">Profit: {car.vehicle.profit}</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleViewDetails(car)}
                                    className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Details</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View Layout (Default)
    return (
        <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Car Image */}
            <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`${car.vehicle.make} ${car.vehicle.model}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Card Content */}
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{car.vehicle.make}</h3>
                        <p className="text-sm text-gray-600">{car.vehicle.year_of_manufacture} • {car.vehicle.color} • {car.vehicle.trimLevel}</p>
                        <p className="text-xs text-gray-500">Grade: {car.vehicle.auction_grade} • {car.vehicle.mileage_km} km</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(car.vehicle_shipping.shipping_status)}`}>
                                    {car.vehicle_shipping.shipping_status}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                        <Package className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 min-w-[80px]">vehicleID:</span>
                        <span className="font-medium text-gray-900">{car.vehicle.id}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <Car className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 min-w-[80px]">Chassis:</span>
                        <span className="font-mono text-xs text-gray-900">{car.vehicle.chassis_id}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <Ship className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 min-w-[80px]">Shipped:</span>
                        <span className="text-gray-900">{formatDate(car.vehicle.created_at)}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 min-w-[80px]">Location:</span>
                        <span className="text-gray-900">{car.vehicle_shipping.departure_harbour}</span>
                    </div>

                    {car.vehicle_shipping && (
                        <div className="flex items-center text-sm">
                            <Truck className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 min-w-[80px]">Vessel:</span>
                            <span className="text-gray-900 text-xs">{car.vehicle_shipping.vessel_name}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-sm">
                        <div className="text-lg font-bold text-blue-600">{car.vehicle.price}</div>
                        {car.profit !== 'N/A' && (
                            <div className="text-xs text-green-600">Profit: {car.vehicle.profit}</div>
                        )}
                    </div>
                    <button
                        onClick={() => handleViewDetails(car)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span>Details</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PreviewCard;