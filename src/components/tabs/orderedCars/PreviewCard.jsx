import React, { useState, useEffect } from "react";
import { Car, Truck, Package, Eye, MapPin, Ship, History, ChevronLeft, ChevronRight} from 'lucide-react';
import {getStatusColor} from "../../common/CommonLogics.js";
import config from "../../../configs/config.json";
import AuthImage from "../../common/AuthImage.jsx";
import {carServiceApi, vehicleService} from "../../../api/index.js";
import ShippingHistory from "./ShippingHistory.jsx";

const PreviewCard= ({car , handleViewDetails, viewMode = 'grid'})=>{
    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showShippingHistory, setShowShippingHistory] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchImageUrls = async () => {
            if (!car.vehicle_image || car.vehicle_image.length === 0) {
                setImageUrls([]);
                setCurrentImageIndex(0);
                return;
            }

            const sortedImages = [...car.vehicle_image].sort((a, b) =>
                +a.display_order - +b.display_order
            );

            try {
                const urlPromises = sortedImages.map(async (image) => {
                    const response = await vehicleService.getVehicleImagePresignedUrl(image.vehicle_id, image.filename);
                    return response.data.presigned_url;
                });

                const urls = await Promise.all(urlPromises);
                setImageUrls(urls);
                setCurrentImageIndex(0);
            } catch (error) {
                console.error('Error fetching image URLs:', error);
                setImageUrls([]);
                setCurrentImageIndex(0);
            }
        };

        fetchImageUrls();
    }, [car.vehicle_image]);

    const handlePreviousImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    };

    // List View Layout
    if (viewMode === 'list') {
        return (
            <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative">
                <div className="flex flex-col md:flex-row">
                    {/* Car Image */}
                    <div className="md:w-64 h-48 md:h-auto bg-gray-200 overflow-hidden flex-shrink-0 relative group">
                        {imageUrls.length > 0 ? (
                            <img
                                src={imageUrls[currentImageIndex]}
                                alt={`${car.vehicle.make} ${car.vehicle.model}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Car className="w-16 h-16 text-gray-300" />
                            </div>
                        )}
                        {/* Navigation Arrows */}
                        {imageUrls.length > 0 && (
                            <>
                                <button
                                    onClick={handlePreviousImage}
                                    disabled={imageUrls.length <= 1}
                                    className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${
                                        imageUrls.length <= 1
                                            ? 'bg-white/40 cursor-not-allowed'
                                            : 'bg-white/60 hover:bg-white/80'
                                    }`}
                                >
                                    <ChevronLeft className={`w-5 h-5 ${imageUrls.length <= 1 ? 'text-gray-400' : 'text-gray-700'}`} />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    disabled={imageUrls.length <= 1}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${
                                        imageUrls.length <= 1
                                            ? 'bg-white/40 cursor-not-allowed'
                                            : 'bg-white/60 hover:bg-white/80'
                                    }`}
                                >
                                    <ChevronRight className={`w-5 h-5 ${imageUrls.length <= 1 ? 'text-gray-400' : 'text-gray-700'}`} />
                                </button>
                                {/* Image counter */}
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                                    {currentImageIndex + 1} / {imageUrls.length}
                                </div>
                            </>
                        )}
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
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(car.vehicle_shipping.shipping_status)}`}>
                                            {car.vehicle_shipping.shipping_status}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowShippingHistory(true);
                                            }}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="View shipping history"
                                        >
                                            <History className="w-4 h-4" />
                                        </button>
                                    </div>
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

                            {/* Footer - Price Section */}
                            <div className="flex md:flex-col justify-between md:justify-start items-end md:items-end md:ml-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                                <div className="text-sm">
                                    <div className="text-lg font-bold text-blue-600">{car.vehicle.price}</div>
                                    {car.profit !== 'N/A' && (
                                        <div className="text-xs text-green-600">Profit: {car.vehicle.profit}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Button - Bottom Right Corner */}
                <button
                    onClick={() => handleViewDetails(car)}
                    className="absolute bottom-3 right-3 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                    title="View Details"
                >
                    <Eye className="w-5 h-5" />
                </button>

                {/* Shipping History Modal */}
                {showShippingHistory && (
                    <ShippingHistory
                        vehicleId={car.vehicle.id}
                        onClose={() => setShowShippingHistory(false)}
                    />
                )}
            </div>
        );
    }

    // Grid View Layout (Default)
    return (
        <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Car Image */}
            <div className="h-48 bg-gray-200 overflow-hidden relative group">
                {imageUrls.length > 0 ? (
                    <img
                        src={imageUrls[currentImageIndex]}
                        alt={`${car.vehicle.make} ${car.vehicle.model}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Car className="w-16 h-16 text-gray-300" />
                    </div>
                )}
                {/* Navigation Arrows */}
                {imageUrls.length > 0 && (
                    <>
                        <button
                            onClick={handlePreviousImage}
                            disabled={imageUrls.length <= 1}
                            className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${
                                imageUrls.length <= 1
                                    ? 'bg-white/40 cursor-not-allowed'
                                    : 'bg-white/60 hover:bg-white/80'
                            }`}
                        >
                            <ChevronLeft className={`w-5 h-5 ${imageUrls.length <= 1 ? 'text-gray-400' : 'text-gray-700'}`} />
                        </button>
                        <button
                            onClick={handleNextImage}
                            disabled={imageUrls.length <= 1}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${
                                imageUrls.length <= 1
                                    ? 'bg-white/40 cursor-not-allowed'
                                    : 'bg-white/60 hover:bg-white/80'
                            }`}
                        >
                            <ChevronRight className={`w-5 h-5 ${imageUrls.length <= 1 ? 'text-gray-400' : 'text-gray-700'}`} />
                        </button>
                        {/* Image counter */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                            {currentImageIndex + 1} / {imageUrls.length}
                        </div>
                    </>
                )}
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
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(car.vehicle_shipping.shipping_status)}`}>
                            {car.vehicle_shipping.shipping_status}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowShippingHistory(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="View shipping history"
                        >
                            <History className="w-4 h-4" />
                        </button>
                    </div>
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

            {/* Shipping History Modal */}
            {showShippingHistory && (
                <ShippingHistory
                    vehicleId={car.vehicle.id}
                    onClose={() => setShowShippingHistory(false)}
                />
            )}
        </div>
    );
}

export default PreviewCard;