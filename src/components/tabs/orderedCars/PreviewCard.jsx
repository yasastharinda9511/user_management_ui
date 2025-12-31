import React, { useState, useEffect } from "react";
import { Car, Truck, Package, Eye, MapPin, Ship, History, ChevronLeft, ChevronRight, Trash2, ShoppingCart, Copy, Check, Star} from 'lucide-react';
import { useSelector } from 'react-redux';
import {getStatusColor} from "../../common/CommonLogics.js";
import config from "../../../configs/config.json";
import AuthImage from "../../common/AuthImage.jsx";
import {carServiceApi, vehicleService} from "../../../api/index.js";
import ShippingHistory from "./ShippingHistory.jsx";
import PurchaseHistory from "./PurchaseHistory.jsx";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import Portal from "../../common/Portal.jsx";
import { selectPermissions } from "../../../state/authSlice.js";
import { hasPermission } from "../../../utils/permissionUtils.js";
import { PERMISSIONS } from "../../../utils/permissions.js";

const PreviewCard= ({car , handleViewDetails, onDelete, viewMode = 'grid'})=>{
    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showShippingHistory, setShowShippingHistory] = useState(false);
    const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [makeLogoUrl, setMakeLogoUrl] = useState(null);
    const [loadingMakeLogo, setLoadingMakeLogo] = useState(false);
    const [isFeatured, setIsFeatured] = useState(car.vehicle.is_featured || false);
    const [updatingFeatured, setUpdatingFeatured] = useState(false);
    const permissions = useSelector(selectPermissions);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleCopyToClipboard = async (text, fieldName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatStatus = (status) => {
        if (!status) return '';
        // Replace underscores with spaces and convert to title case
        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const getSaleStatusColor = (status) => {
        switch (status) {
            case 'SOLD':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'RESERVED':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'AVAILABLE':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getPurchaseStatusColor = (status) => {
        switch (status) {
            case 'PURCHASED':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'PENDING':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'CANCELLED':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
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

    useEffect(() => {
        const fetchMakeLogo = async () => {
            if (!car.vehicle.make_id) {
                setMakeLogoUrl(null);
                return;
            }

            try {
                setLoadingMakeLogo(true);
                const response = await vehicleService.getMakeLogo(car.vehicle.make_id);
                setMakeLogoUrl(response.data.presigned_url);
            } catch (error) {
                console.error('Error fetching make logo:', error);
                setMakeLogoUrl(null);
            } finally {
                setLoadingMakeLogo(false);
            }
        };

        fetchMakeLogo();
    }, [car.vehicle.make_id]);

    const handlePreviousImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteModal(false);
        setIsDeleting(true);

        // Wait for animation to complete (300ms as defined in CSS)
        setTimeout(async () => {
            try {
                await vehicleService.deleteVehicle(car.vehicle.id);
                if (onDelete) {
                    onDelete(car.vehicle.id);
                }
            } catch (error) {
                console.error('Failed to delete vehicle:', error);
                alert('Failed to delete vehicle. Please try again.');
                setIsDeleting(false); // Reset if error occurs
            }
        }, 300);
    };

    const handleToggleFeatured = async (e) => {
        e.stopPropagation();

        if (updatingFeatured) return;

        try {
            setUpdatingFeatured(true);
            const newFeaturedStatus = !isFeatured;
            await vehicleService.updateFeaturedStatus(car.vehicle.id, newFeaturedStatus);
            setIsFeatured(newFeaturedStatus);
        } catch (error) {
            console.error('Failed to update featured status:', error);
            alert('Failed to update featured status. Please try again.');
        } finally {
            setUpdatingFeatured(false);
        }
    };

    // List View Layout
    if (viewMode === 'list') {
        return (
            <>
            <div key={car.id} className={`bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm border-l-2 border-blue-300 overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all relative h-auto md:h-64 ${isDeleting ? 'deleting' : ''}`}>
                <div className="flex flex-col md:flex-row h-full">
                    {/* Car Image */}
                    <div className="md:w-64 h-48 md:h-full bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden flex-shrink-0 relative group">
                        {imageUrls.length > 0 ? (
                            <img
                                src={imageUrls[currentImageIndex]}
                                alt={`${car.vehicle.make} ${car.vehicle.model}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                                <Car className="w-16 h-16 text-blue-300" />
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
                        {/* Featured Badge */}

                        <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-white" />
                            Featured
                        </div>

                    </div>

                    {/* Card Content */}
                    <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row justify-between h-full">
                            <div className="flex-1">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start gap-3">
                                        {/* Make Logo */}
                                        {makeLogoUrl && (
                                            <div className="w-12 h-12 flex-shrink-0 bg-white border border-gray-200 rounded-lg p-1.5 flex items-center justify-center">
                                                <img
                                                    src={makeLogoUrl}
                                                    alt={`${car.vehicle.make} logo`}
                                                    className="max-w-full max-h-full object-contain"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{car.vehicle.make}</h3>
                                            <p className="text-sm text-gray-700 font-medium">{car.vehicle.year_of_manufacture} • {car.vehicle.color} • {car.vehicle.trimLevel}</p>
                                            <p className="text-xs text-gray-600">Grade: {car.vehicle.auction_grade} • {car.vehicle.mileage_km} km</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(car.vehicle_shipping.shipping_status)} tracking-wide text-center inline-flex items-center justify-center`}>
                                                {formatStatus(car.vehicle_shipping.shipping_status)}
                                            </span>
                                            {car.vehicle_purchase?.purchase_status && (
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPurchaseStatusColor(car.vehicle_purchase.purchase_status)} tracking-wide text-center inline-flex items-center justify-center`}>
                                                    {formatStatus(car.vehicle_purchase.purchase_status)}
                                                </span>
                                            )}
                                        </div>
                                        {car.vehicle_sale?.sale_status && (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getSaleStatusColor(car.vehicle_sale.sale_status)} tracking-wide text-center inline-flex items-center justify-center`}>
                                                {formatStatus(car.vehicle_sale.sale_status)}
                                            </span>
                                        )}
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
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowPurchaseHistory(true);
                                            }}
                                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                            title="View purchase history"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center text-sm">
                                        <Package className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">Code:  </span>
                                        <span className="font-semibold text-blue-700">{car.vehicle.code ? `${car.vehicle.code}` : 'N/A'}</span>
                                        {car.vehicle.code && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopyToClipboard(`${car.vehicle.code}`, 'vehicleCode');
                                                }}
                                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                title="Copy Vehicle Code"
                                            >
                                                {copiedField === 'vehicleCode' ? (
                                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Car className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">Chassis:</span>
                                        <span className="font-mono text-xs text-gray-900">{car.vehicle.chassis_id}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyToClipboard(car.vehicle.chassis_id, 'chassisId');
                                            }}
                                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                            title="Copy Chassis Number"
                                        >
                                            {copiedField === 'chassisId' ? (
                                                <Check className="w-3.5 h-3.5 text-green-600" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Ship className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">Shipped:</span>
                                        <span className="text-gray-900">{formatDate(car.vehicle.created_at)}</span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <MapPin className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">Location:</span>
                                        <span className="text-gray-900">{car.vehicle_shipping.departure_harbour}</span>
                                    </div>

                                    {car.vehicle_shipping && (
                                        <div className="flex items-center text-sm">
                                            <Truck className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Button - Top Right Corner */}
                {hasPermission(permissions, PERMISSIONS.CAR_DELETE) && (
                    <button
                        onClick={handleDeleteClick}
                        className="absolute top-3 right-3 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors z-10"
                        title="Delete Vehicle"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}

                {/* Featured Toggle Button */}
                {hasPermission(permissions, PERMISSIONS.CAR_UPDATE) && (
                    <button
                        onClick={handleToggleFeatured}
                        disabled={updatingFeatured}
                        className={`absolute bottom-3 right-16 p-2 rounded-full transition-colors ${
                            isFeatured
                                ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                        } ${updatingFeatured ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    >
                        <Star className={`w-5 h-5 ${isFeatured ? 'fill-yellow-600' : ''}`} />
                    </button>
                )}

                {/* Details Button - Bottom Right Corner */}
                <button
                    onClick={() => handleViewDetails(car)}
                    className="absolute bottom-3 right-3 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                    title="View Details"
                >
                    <Eye className="w-5 h-5" />
                </button>
            </div>

            {/* Shipping History Modal */}
            {showShippingHistory && (
                <Portal>
                    <ShippingHistory
                        vehicleId={car.vehicle.id}
                        onClose={() => setShowShippingHistory(false)}
                    />
                </Portal>
            )}

            {/* Purchase History Modal */}
            {showPurchaseHistory && (
                <Portal>
                    <PurchaseHistory
                        vehicleId={car.vehicle.id}
                        onClose={() => setShowPurchaseHistory(false)}
                    />
                </Portal>
            )}

            {/* Delete Confirmation Modal */}
            <Portal>
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Vehicle"
                    message={`Are you sure you want to delete ${car.vehicle.make} ${car.vehicle.model}? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                />
            </Portal>
            </>
        );
    }

    // Grid View Layout (Default)
    return (
        <>
        <div key={car.id} className={`bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm border-t-2 border-blue-300 overflow-hidden hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 h-[600px] flex flex-col ${isDeleting ? 'deleting' : ''}`}>
            {/* Car Image */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden relative group">
                {imageUrls.length > 0 ? (
                    <img
                        src={imageUrls[currentImageIndex]}
                        alt={`${car.vehicle.make} ${car.vehicle.model}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <Car className="w-16 h-16 text-blue-300" />
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
                {/* Featured Badge */}
                {isFeatured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-white" />
                        Featured
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3 flex-1">
                        {/* Make Logo */}
                        {makeLogoUrl && (
                            <div className="w-12 h-12 flex-shrink-0 bg-white border border-gray-200 rounded-lg p-1.5 flex items-center justify-center">
                                <img
                                    src={makeLogoUrl}
                                    alt={`${car.vehicle.make} logo`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{car.vehicle.make}</h3>
                            <p className="text-sm text-gray-700 font-medium">{car.vehicle.year_of_manufacture} • {car.vehicle.color} • {car.vehicle.trimLevel}</p>
                            <p className="text-xs text-gray-600">Grade: {car.vehicle.auction_grade} • {car.vehicle.mileage_km} km</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(car.vehicle_shipping.shipping_status)} tracking-wide text-center inline-flex items-center justify-center`}>
                                {formatStatus(car.vehicle_shipping.shipping_status)}
                            </span>
                            {car.vehicle_purchase?.purchase_status && (
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPurchaseStatusColor(car.vehicle_purchase.purchase_status)} tracking-wide text-center inline-flex items-center justify-center`}>
                                    {formatStatus(car.vehicle_purchase.purchase_status)}
                                </span>
                            )}
                        </div>
                        {car.vehicle_sale?.sale_status && (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getSaleStatusColor(car.vehicle_sale.sale_status)} tracking-wide text-center inline-flex items-center justify-center`}>
                                {formatStatus(car.vehicle_sale.sale_status)}
                            </span>
                        )}
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
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPurchaseHistory(true);
                            }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                            title="View purchase history"
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-3 mb-4 flex-1 overflow-auto">
                    <div className="flex items-center text-sm">
                        <Package className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 min-w-[80px]">Code:  </span>
                        <span className="font-semibold text-blue-600">{car.vehicle.code ? `${car.vehicle.code}` : 'N/A'}</span>
                        {car.vehicle.code && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyToClipboard(`${car.vehicle.code}`, 'vehicleCode');
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title="Copy Vehicle Code"
                            >
                                {copiedField === 'vehicleCode' ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center text-sm">
                        <Car className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 min-w-[80px]">Chassis:</span>
                        <span className="font-mono text-xs text-gray-900">{car.vehicle.chassis_id}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopyToClipboard(car.vehicle.chassis_id, 'chassisId');
                            }}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Copy Chassis Number"
                        >
                            {copiedField === 'chassisId' ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center text-sm">
                        <Ship className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 min-w-[80px]">Shipped:</span>
                        <span className="text-gray-900">{formatDate(car.vehicle.created_at)}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 min-w-[80px]">Location:</span>
                        <span className="text-gray-900">{car.vehicle_shipping.departure_harbour}</span>
                    </div>

                    {car.vehicle_shipping && (
                        <div className="flex items-center text-sm">
                            <Truck className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 min-w-[80px]">Vessel:</span>
                            <span className="text-gray-900 text-xs">{car.vehicle_shipping.vessel_name}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                    <div className="text-sm">
                        <div className="text-lg font-bold text-blue-600">{car.vehicle.price}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasPermission(permissions, PERMISSIONS.CAR_DELETE) && (
                            <button
                                onClick={handleDeleteClick}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        )}
                        {hasPermission(permissions, PERMISSIONS.CAR_UPDATE) && (
                            <button
                                onClick={handleToggleFeatured}
                                disabled={updatingFeatured}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                    isFeatured
                                        ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                                        : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                                } ${updatingFeatured ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isFeatured ? 'Remove from featured' : 'Mark as featured'}
                            >
                                <Star className={`w-4 h-4 ${isFeatured ? 'fill-yellow-600' : ''}`} />
                                <span>{isFeatured ? 'Featured' : 'Feature'}</span>
                            </button>
                        )}
                        <button
                            onClick={() => handleViewDetails(car)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            <span>Details</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Shipping History Modal */}
        {showShippingHistory && (
            <Portal>
                <ShippingHistory
                    vehicleId={car.vehicle.id}
                    onClose={() => setShowShippingHistory(false)}
                />
            </Portal>
        )}

        {/* Purchase History Modal */}
        {showPurchaseHistory && (
            <Portal>
                <PurchaseHistory
                    vehicleId={car.vehicle.id}
                    onClose={() => setShowPurchaseHistory(false)}
                />
            </Portal>
        )}

        {/* Delete Confirmation Modal */}
        <Portal>
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Vehicle"
                message={`Are you sure you want to delete ${car.vehicle.make} ${car.vehicle.model}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </Portal>
        </>
    );
}

export default PreviewCard;