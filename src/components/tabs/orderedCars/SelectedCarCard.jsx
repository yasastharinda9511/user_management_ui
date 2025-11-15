import React, { useState, useRef, useEffect, useCallback } from "react";
import {useDispatch, useSelector} from "react-redux";
import { Plus } from 'lucide-react';
import {
    updateVehicle,
    updateVehicleFinancials, updateVehiclePurchase,
    updateVehicleShipping
} from "../../../state/vehicleSlice.js";
import Notification from "../../common/Notification.jsx"
import {SELECTED_VEHICLE_CARD_OPTIONS} from "../../common/Costants.js";
import {hasPermission} from "../../../utils/permissionUtils.js";
import {PERMISSIONS} from "../../../utils/permissions.js";
import {selectPermissions} from "../../../state/authSlice.js";
import { VehicleSections} from "./vehicleSections.jsx";
import {vehicleService} from "../../../api/index.js";

const SelectedCarCard = ({selectedCar, closeModal, onSave}) => {
    const dispatch = useDispatch();
    const [currentSection, setCurrentSection] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [imageTouchStart, setImageTouchStart] = useState(null);
    const [imageTouchEnd, setImageTouchEnd] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const containerRef = useRef(null);
    const imageContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });
    const permissions = useSelector(selectPermissions);
    const [imageUrls, setImageUrls] = useState([]);
    const [uploading, setUploading] = useState(false);


    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    // Fetch all image URLs when component mounts or selectedCar changes
    useEffect(() => {
        const fetchAllImageUrls = async () => {
            if (!selectedCar?.vehicle_image || selectedCar.vehicle_image.length === 0) {
                setImageUrls([]);
                return;
            }

            const images = [...selectedCar.vehicle_image];
            const sortedImages = images.sort((a, b) => a.display_order - b.display_order);

            const urls = await Promise.all(
                sortedImages.map(async (img) => {
                    try {
                        const response = await vehicleService.getVehicleImagePresignedUrl(img.filename);
                        console.log('Fetched image URL:', response.data.presigned_url);
                        return response.data?.presigned_url || null;
                    } catch (error) {
                        console.error('Error fetching vehicle image', img.filename, error);
                        return null;
                    }
                })
            );

            // Filter out failed (null) results
            setImageUrls(urls.filter(Boolean));
        };

        fetchAllImageUrls();
        setCurrentImageIndex(0); // Reset image index when car changes
    }, [selectedCar]);

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            await vehicleService.uploadVehicleImages(vehicle.id, Array.from(files));
            showNotification('success', 'Success', `${files.length} image(s) uploaded successfully`);

            // Refresh images after upload
            const images = [...selectedCar.vehicle_image];
            const sortedImages = images.sort((a, b) => a.display_order - b.display_order);

            const urls = await Promise.all(
                sortedImages.map(async (img) => {
                    try {
                        const response = await vehicleService.getVehicleImagePresignedUrl(img.filename);
                        return response.data?.presigned_url || null;
                    } catch (error) {
                        console.error('Error fetching vehicle image', img.filename, error);
                        return null;
                    }
                })
            );

            setImageUrls(urls.filter(Boolean));
        } catch (error) {
            console.error('Error uploading images:', error);
            showNotification('error', 'Error', 'Failed to upload images: ' + error.message);
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'DELIVERED': 'bg-green-100 text-green-800 border-green-200',
            'CLEARED': 'bg-blue-100 text-blue-800 border-blue-200',
            'ARRIVED': 'bg-purple-100 text-purple-800 border-purple-200',
            'SHIPPED': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'PROCESSING': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
    };

    const hideNotification = () => {
        setNotification({ show: false, type: '', title: '', message: '' });
    };

    const formatCurrency = (amount, currency = 'LKR') => {
        if (!amount) return 'N/A';
        return `${currency} ${amount.toLocaleString()}`;
    };

    // Safety check
    if (!selectedCar) return null;

    const vehicle = selectedCar.vehicle || {};
    const shipping = selectedCar.vehicle_shipping || {};
    const financials = selectedCar.vehicle_financials || {};
    const sales = selectedCar.vehicle_sales || {};
    const purchase = selectedCar.vehicle_purchase || {};
    const images = selectedCar.vehicle_image || {};

    // Initialize edited data
    useEffect(() => {
        setEditedData({
            vehicle: { ...vehicle },
            shipping: { ...shipping },
            financials: { ...financials },
            sales: { ...sales },
            purchase: { ...purchase }
        });
    }, [selectedCar]);

    const startEdit = (sectionIndex) => {
        setEditingSection(sectionIndex);
        setOriginalData({
            vehicle: { ...vehicle },
            shipping: { ...shipping },
            financials: { ...financials },
            sales: { ...sales },
            purchase: { ...purchase }
        });
    };

    const cancelEdit = () => {
        setEditedData(originalData);
        setEditingSection(null);
    };

    const saveEdit = async () => {
        if (onSave) {
            onSave(editedData);
        }

        try {
            switch (sections[currentSection].title) {
                case SELECTED_VEHICLE_CARD_OPTIONS.VEHICLE_INFORMATION:
                    await dispatch(updateVehicle({
                        vehicleId: vehicle.id,
                        updateData: editedData.vehicle,
                    })).unwrap();
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.VEHICLE_INFORMATION} Updated Successfully`);
                    setOriginalData(prev =>({
                        ...prev,
                        ["vehicle"]: editedData.vehicle,
                    }));
                    break;

                case SELECTED_VEHICLE_CARD_OPTIONS.SHIPPING_DETAILS:
                    await dispatch(updateVehicleShipping({
                        vehicleId: vehicle.id,
                        shippingData: editedData.shipping,
                    })).unwrap();
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.SHIPPING_DETAILS} Updated Successfully`);
                    setOriginalData(prev =>({
                        ...prev,
                        ["shipping"]: editedData.shipping,
                    }));
                    break;

                case SELECTED_VEHICLE_CARD_OPTIONS.PURCHASE_DETAILS:
                    await dispatch(updateVehiclePurchase({
                        vehicleId: vehicle.id,
                        purchaseData: editedData.purchase,
                    })).unwrap();
                    setOriginalData(prev =>({
                        ...prev,
                        ["purchase"]: editedData.purchase,
                    }));
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.PURCHASE_DETAILS} Updated Successfully`);
                    break;

                case SELECTED_VEHICLE_CARD_OPTIONS.FINANCIAL_SUMMARY:
                    await dispatch(updateVehicleFinancials({
                        vehicleId: vehicle.id,
                        financialData: editedData.financials,
                    })).unwrap();
                    setOriginalData(prev =>({
                        ...prev,
                        ["financials"]: editedData.financials,
                    }));
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.FINANCIAL_SUMMARY} Updated Successfully`);
                    break;

                default:
                    // Handle unexpected section or no action needed
                    console.warn('Unknown section title:', sections[currentSection].title);
                    break;
            }
        }catch (error) {
            showNotification('error', 'Error', 'Update failed: ' + error.message);
        }
    };

    const updateField = useCallback((section, field, value) => {
        setEditedData(prev => {
            const updatedSection = {
                ...prev[section],
                [field]: value
            }

            if (section === "financials"){
                updatedSection.total_cost_lkr = calculateTotalCost(updatedSection);
            }

            return {
                ...prev,
                [section]: updatedSection,
            };
        });
    }, []);

    const calculateTotalCost = (financials) => {
        const tt_charges = parseFloat(financials?.tt_lkr)
        const charges = parseFloat(financials?.charges_lkr) || 0;
        const duty = parseFloat(financials?.duty_lkr) || 0;
        const clearing = parseFloat(financials?.clearing_lkr) || 0;
        const otherExpenses = parseFloat(financials?.other_expenses_lkr) || 0;

        console.log(tt_charges + charges + duty + clearing + otherExpenses)
        return tt_charges + charges + duty + clearing + otherExpenses;
    };

// Centralized callback function
    const updateTotalCost = () => {
        const newTotal = calculateTotalCost(editedData.financials);
        updateField("financials","total_cost_lkr", newTotal);
    };

    // Define sections with editable fields using the extracted configuration
    const sections = VehicleSections({
        editedData,
        vehicle,
        shipping,
        financials,
        sales,
        purchase,
        editingSection,
        updateField,
        formatDate,
        formatCurrency
    });

    const onTouchStart = (e) => {
        if (editingSection !== null) return; // Disable swipe while editing
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        if (editingSection !== null) return;
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (editingSection !== null) return;
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
        }
        if (isRightSwipe && currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    const goToSection = (index) => {
        if (editingSection !== null) return; // Disable navigation while editing
        setCurrentSection(index);
    };

    const nextSection = () => {
        if (editingSection !== null) return;
        if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
        }
    };

    const prevSection = () => {
        if (editingSection !== null) return;
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    // Image swipe handlers
    const onImageTouchStart = (e) => {
        setImageTouchEnd(null);
        setImageTouchStart(e.targetTouches[0].clientX);
    };

    const onImageTouchMove = (e) => {
        setImageTouchEnd(e.targetTouches[0].clientX);
    };

    const onImageTouchEnd = () => {
        if (!imageTouchStart || !imageTouchEnd) return;

        const distance = imageTouchStart - imageTouchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentImageIndex < imageUrls.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
        if (isRightSwipe && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const nextImage = () => {
        if (currentImageIndex < imageUrls.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Deal Details</h2>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Vehicle Image and Basic Info */}
                        <div>
                            {/* Image Container with Swipe */}
                            <div className="relative mb-4 group">
                                <div
                                    ref={imageContainerRef}
                                    className="relative overflow-hidden rounded-lg bg-gray-100"
                                    onTouchStart={onImageTouchStart}
                                    onTouchMove={onImageTouchMove}
                                    onTouchEnd={onImageTouchEnd}
                                >
                                    <img
                                        src={imageUrls[currentImageIndex]}
                                        alt={`${editedData.vehicle?.make || vehicle.make} ${editedData.vehicle?.model || vehicle.model} - Image ${currentImageIndex + 1}`}
                                        className="w-full h-64 object-contain transition-opacity duration-300"
                                    />

                                    {/* Navigation Arrows */}
                                    {imageUrls.length > 1 && (
                                        <>
                                            {currentImageIndex > 0 && (
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                            )}
                                            {currentImageIndex < imageUrls.length - 1 && (
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    {imageUrls.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                            {currentImageIndex + 1} / {imageUrls.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Bar */}
                                <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                                    {imageUrls.length > 0 && imageUrls.map((imageUrl, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                index === currentImageIndex
                                                    ? 'border-blue-600 ring-2 ring-blue-200'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}

                                    {/* Add Image Button */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all flex items-center justify-center bg-gray-50 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Add images"
                                    >
                                        {uploading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        ) : (
                                            <Plus className="w-6 h-6 text-gray-400" />
                                        )}
                                    </button>

                                    {/* Hidden File Input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editedData.vehicle?.make || vehicle.make} {editedData.vehicle?.model || vehicle.model}
                                </h3>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(editedData.shipping?.shipping_status || shipping.shipping_status)}`}>
                                    {editedData.shipping?.shipping_status || shipping.shipping_status || 'PROCESSING'}
                                </span>
                            </div>
                        </div>

                        {/* Right Column - Swipable Sections */}
                        <div className="relative">
                            {/* Section Navigation Dots */}
                            <div className="flex justify-center mb-4 space-x-2">
                                {sections.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSection(index)}
                                        disabled={editingSection !== null}
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                            index === currentSection ? 'bg-blue-600' : 'bg-gray-300'
                                        } ${editingSection !== null ? 'cursor-not-allowed opacity-50' : ''}`}
                                    />
                                ))}
                            </div>

                            {/* Section Title and Edit Button */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-center flex-1">
                                    <h4 className="font-semibold text-gray-900 text-lg">
                                        {sections[currentSection]?.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {currentSection + 1} of {sections.length}
                                    </p>
                                </div>
                                {editingSection === null && hasPermission(permissions, PERMISSIONS.CAR_UPDATE) &&
                                    (<button
                                        onClick={() => startEdit(currentSection)}
                                        className="ml-2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit section"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Save/Cancel Buttons */}
                            {editingSection === currentSection && (
                                <div className="flex justify-center space-x-2 mb-4">
                                    <button
                                        onClick={saveEdit}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {/* Swipable Content Container */}
                            <div
                                ref={containerRef}
                                className="relative overflow-hidden"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                <div
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(-${currentSection * 100}%)` }}
                                >
                                    {sections.map((section, index) => (
                                        <div key={index} className="w-full flex-shrink-0">
                                            <div className={`${section.color} rounded-lg p-4 min-h-[300px]`}>
                                                {section.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={prevSection}
                                    disabled={currentSection === 0 || editingSection !== null}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        currentSection === 0 || editingSection !== null
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                >
                                    ← Previous
                                </button>

                                <span className="text-sm text-gray-500">
                                    {editingSection !== null ? 'Editing mode' : 'Swipe to navigate'}
                                </span>

                                <button
                                    onClick={nextSection}
                                    disabled={currentSection === sections.length - 1 || editingSection !== null}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        currentSection === sections.length - 1 || editingSection !== null
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default SelectedCarCard;