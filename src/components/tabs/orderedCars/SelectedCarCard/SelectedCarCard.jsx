import React, { useState, useRef, useEffect, useCallback } from "react";
import {useDispatch, useSelector} from "react-redux";
import { Plus, History, Download, ShoppingCart } from 'lucide-react';
import {
    fetchVehicleById, selectSelectedCar,
    updateVehicle,
    updateVehicleFinancials, updateVehiclePurchase,
    updateVehicleShipping,
    updateVehicleSales
} from "../../../../state/vehicleSlice.js";
import { selectSelectedCustomer, selectLoadingCustomer, clearSelectedCustomer } from "../../../../state/customerSlice.js";
import { selectSelectedSupplier, selectLoadingSupplier, clearSelectedSupplier } from "../../../../state/supplierSlice.js";
import Notification from "../../../common/Notification.jsx"
import {SELECTED_VEHICLE_CARD_OPTIONS} from "../../../common/Costants.js";
import {hasPermission} from "../../../../utils/permissionUtils.js";
import {PERMISSIONS} from "../../../../utils/permissions.js";
import {selectPermissions} from "../../../../state/authSlice.js";
import { VehicleSections} from "./vehicleSections.jsx";
import {vehicleService} from "../../../../api/index.js";
import SelectCustomerModal from "../SelectCustomerModal.jsx";
import SelectSupplierModal from "../SelectSupplierModal.jsx";
import ViewCustomerModal from "../ViewCustomerModal.jsx";
import ImageViewer from "../../../common/ImageViewer.jsx";
import ShippingHistory from "../ShippingHistory.jsx";
import PurchaseHistory from "../PurchaseHistory.jsx";
import {convertToRFC3339} from "../../../../utils/common.js";

const SelectedCarCard = ({id, closeModal, onSave}) => {
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
    const [loadingImages, setLoadingImages] = useState(true);
    const [sections, setSections] = useState([]);
    const [showSelectCustomerModal, setShowSelectCustomerModal] = useState(false);
    const [showViewCustomerModal, setShowViewCustomerModal] = useState(false);
    const [showSelectSupplierModal, setShowSelectSupplierModal] = useState(false);
    const [showShippingHistory, setShowShippingHistory] = useState(false);
    const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);

    const selectedCar = useSelector(selectSelectedCar);
    const selectedCustomer = useSelector(selectSelectedCustomer);
    const loadingCustomer = useSelector(selectLoadingCustomer);
    const selectedSupplier = useSelector(selectSelectedSupplier);
    const loadingSupplier = useSelector(selectLoadingSupplier);

    let vehicle = useRef({});
    let shipping = useRef({});
    let financials = useRef({});
    let sales = useRef({})
    let purchase = useRef({});
    let images = useRef({});
    let documents = useRef({});

    useEffect(() => {
        dispatch(fetchVehicleById(id));
    }, [dispatch, id])

    // Handle viewing customer details (view mode - not editing)


    // Handle opening customer selection modal (edit mode)
    const handleSelectChangeCustomer = () => {
        setShowSelectCustomerModal(true);
    };

    const handleCloseViewCustomerModal = () => {
        setShowViewCustomerModal(false);
        dispatch(clearSelectedCustomer());
    };

    const handleCloseSelectCustomerModal = () => {
        setShowSelectCustomerModal(false);
        dispatch(clearSelectedCustomer());
    };

    // Handle customer selection - update the sales data with new customer_id
    const handleSelectCustomer = (customerId) => {
        console.log('Customer selected:', customerId);
        // Update the editedData with the new customer_id
        updateField('sales', 'customer_id', customerId);
        showNotification('success', 'Customer Updated', 'Customer has been assigned to this sale');
    };

    // Handle opening supplier selection modal (edit mode)
    const handleSelectChangeSupplier = () => {
        setShowSelectSupplierModal(true);
    };

    const handleCloseSelectSupplierModal = () => {
        setShowSelectSupplierModal(false);
        dispatch(clearSelectedSupplier());
    };

    // Handle supplier selection - update the purchase data with new supplier_id
    const handleSelectSupplier = (supplierId) => {
        console.log('Supplier selected:', supplierId);
        // Update the editedData with the new supplier_id
        updateField('purchase', 'supplier_id', supplierId);
        showNotification('success', 'Supplier Updated', 'Supplier has been assigned to this purchase');
    };

    // Handle opening purchase history modal
    const handleShowPurchaseHistory = () => {
        setShowPurchaseHistory(true);
    };

    // Handle opening shipping history modal
    const handleShowShippingHistory = () => {
        setShowShippingHistory(true);
    };

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    // Fetch all image URLs when component mounts or selectedCar changes
    useEffect(() => {
        const fetchAllImageUrls = async () => {
            setLoadingImages(true);
            if (!selectedCar?.vehicle_image || selectedCar.vehicle_image.length === 0) {
                setImageUrls([]);
                setLoadingImages(false);
                return;
            }

            const images = [...selectedCar.vehicle_image];
            const sortedImages = images.sort((a, b) => a.display_order - b.display_order);

            const urls = await Promise.all(
                sortedImages.map(async (img) => {
                    try {
                        const response = await vehicleService.getVehicleImagePresignedUrl(img.vehicle_id, img.filename);
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
            setLoadingImages(false);
        };

        fetchAllImageUrls();
        setCurrentImageIndex(0); // Reset image index when car changes
    }, [selectedCar]);

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setLoadingImages(true);
        try {
            await vehicleService.uploadVehicleImages(vehicle.current.id, Array.from(files));
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
            setLoadingImages(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            dispatch(fetchVehicleById(id));
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

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
    };

    const hideNotification = () => {
        setNotification({ show: false, type: '', title: '', message: '' });
    };

    useEffect(()=>{
        setSections(VehicleSections({
            permissions,
            editedData,
            vehicle :vehicle.current,
            shipping : shipping.current,
            financials :financials.current,
            sales : sales.current,
            purchase :purchase.current,
            documents :documents.current,
            editingSection,
            updateField,
            showNotification,
            onSelectChangeCustomer: handleSelectChangeCustomer,
            onSelectChangeSupplier: handleSelectChangeSupplier,
            onShowPurchaseHistory: handleShowPurchaseHistory,
            onShowShippingHistory: handleShowShippingHistory,
            vehicleId: id
        }));
    }, [editingSection, editedData])
    // Initialize edited data
    useEffect(() => {

        if (!selectedCar) return;
        vehicle.current = selectedCar.vehicle;
        shipping.current =selectedCar.vehicle_shipping;
        financials.current = selectedCar.vehicle_financials;
        sales.current = selectedCar.vehicle_sales;
        purchase.current = selectedCar.vehicle_purchase;
        images.current = selectedCar.vehicle_image;
        documents.current = selectedCar.vehicle_documents;

        setEditedData({
            vehicle: { ...vehicle.current },
            shipping: { ...shipping.current },
            financials: { ...financials.current },
            sales: { ...sales.current },
            purchase: { ...purchase.current },
            images:{...images.current},
            documents: { ...documents.current },
        });
    }, [selectedCar]);

    const startEdit = (sectionIndex) => {
        setEditingSection(sectionIndex);
        setOriginalData({
            vehicle: { ...vehicle.current },
            shipping: { ...shipping.current },
            financials: { ...financials.current },
            sales: { ...sales.current },
            purchase: { ...purchase.current },
            images:{...images.current},
            documents: { ...documents.current },
        });
    };

    const cancelEdit = () => {
        setEditedData(originalData);
        setEditingSection(null);
    };

    // Helper function to convert date fields in an object
    const convertDateFields = (data, dateFields) => {
        const converted = { ...data };
        dateFields.forEach(field => {
            if (converted[field] !== null && converted[field] !== undefined && converted[field] !== '') {
                converted[field] = convertToRFC3339(converted[field]);
            } else {
                converted[field] = null;
            }
        });
        return converted;
    };

    const saveEdit = async () => {
        if (onSave) {
            onSave(editedData);
        }

        try {
            switch (sections[currentSection].title) {
                case SELECTED_VEHICLE_CARD_OPTIONS.VEHICLE_INFORMATION:
                    await dispatch(updateVehicle({
                        vehicleId: vehicle.current.id,
                        updateData: editedData.vehicle,
                    })).unwrap();
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.VEHICLE_INFORMATION} Updated Successfully`);
                    setOriginalData(prev =>({
                        ...prev,
                        ["vehicle"]: editedData.vehicle,
                    }));
                    break;

                case SELECTED_VEHICLE_CARD_OPTIONS.SHIPPING_DETAILS:
                    const shippingData = convertDateFields(editedData.shipping, ['shipment_date', 'arrival_date', 'clearing_date']);
                    await dispatch(updateVehicleShipping({
                        vehicleId: vehicle.current.id,
                        shippingData: shippingData,
                    })).unwrap();
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.SHIPPING_DETAILS} Updated Successfully`);
                    setOriginalData(prev =>({
                        ...prev,
                        ["shipping"]: editedData.shipping,
                    }));
                    break;

                case SELECTED_VEHICLE_CARD_OPTIONS.PURCHASE_DETAILS:
                    const purchaseData = convertDateFields(editedData.purchase, ['purchase_date']);
                    await dispatch(updateVehiclePurchase({
                        vehicleId: vehicle.current.id,
                        purchaseData: purchaseData,
                    })).unwrap();
                    setOriginalData(prev =>({
                        ...prev,
                        ["purchase"]: editedData.purchase,
                    }));
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.PURCHASE_DETAILS} Updated Successfully`);
                    break;

                case SELECTED_VEHICLE_CARD_OPTIONS.FINANCIAL_SUMMARY:
                    await dispatch(updateVehicleFinancials({
                        vehicleId: vehicle.current.id,
                        financialData: editedData.financials,
                    })).unwrap();
                    setOriginalData(prev =>({
                        ...prev,
                        ["financials"]: editedData.financials,
                    }));
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.FINANCIAL_SUMMARY} Updated Successfully`);
                    break;

                case SELECTED_VEHICLE_CARD_OPTIONS.SALES_INFORMATION:
                    const salesData = convertDateFields(editedData.sales, ['sold_date']);
                    await dispatch(updateVehicleSales({
                        vehicleId: vehicle.current.id,
                        salesData: salesData,
                    })).unwrap();
                    setOriginalData(prev =>({
                        ...prev,
                        ["sales"]: editedData.sales,
                    }));
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.SALES_INFORMATION} Updated Successfully`);
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

    const handleDownloadImage = async (imageIndex = null) => {
        try {
            const index = imageIndex !== null ? imageIndex : currentImageIndex;
            const image = imageUrls[index];
            const response = await fetch(image);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `vehicle-image-${index + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
            showNotification('error', 'Download Failed', 'Failed to download image');
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
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold text-gray-900">Deal Details</h2>
                            <button
                                onClick={() => setShowShippingHistory(true)}
                                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                title="View shipping history"
                            >
                                <History className="w-3.5 h-3.5" />
                                <span>Shipping</span>
                            </button>
                            <button
                                onClick={() => setShowPurchaseHistory(true)}
                                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                title="View purchase history"
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Purchase</span>
                            </button>
                        </div>
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
                                    {loadingImages ? (
                                        <div className="w-full h-64 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={imageUrls[currentImageIndex]}
                                                alt={`${editedData.vehicle?.make || vehicle.current.make} ${editedData.vehicle?.model || vehicle.current.model} - Image ${currentImageIndex + 1}`}
                                                className="w-full h-64 object-contain transition-opacity duration-300 cursor-pointer hover:opacity-90"
                                                onClick={() => setShowImageViewer(true)}
                                                title="Click to view fullscreen"
                                            />

                                            {/* Download Button */}
                                            <button
                                                onClick={handleDownloadImage}
                                                className="absolute top-2 left-2 bg-white/80 hover:bg-white text-blue-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                title="Download Image"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>

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
                                        </>
                                    )}
                                </div>

                                {/* Thumbnail Bar */}
                                <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                                    {imageUrls.length > 0 && imageUrls.map((imageUrl, index) => (
                                        <div
                                            key={index}
                                            className={`group relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                                index === currentImageIndex
                                                    ? 'border-blue-600 ring-2 ring-blue-200'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Download Overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownloadImage(index);
                                                    }}
                                                    className="p-2 bg-white/90 hover:bg-white rounded-full text-blue-600 transition-all transform hover:scale-110 shadow-lg"
                                                    title="Download this image"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
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
                                    {editedData.vehicle?.make || vehicle.current.make} {editedData.vehicle?.model || vehicle.current.model}
                                </h3>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(editedData.shipping?.shipping_status || shipping.current.shipping_status)}`}>
                                    {editedData.shipping?.shipping_status || shipping.current.shipping_status || 'PROCESSING'}
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
                                    <h4 className={`font-semibold text-lg transition-all ${
                                        editingSection === currentSection
                                            ? 'text-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent'
                                            : 'text-gray-900'
                                    }`}>
                                        {editingSection === currentSection && '✏️ '}
                                        {sections[currentSection]?.title}
                                    </h4>
                                    <p className={`text-sm transition-colors ${
                                        editingSection === currentSection ? 'text-blue-500 font-medium' : 'text-gray-500'
                                    }`}>
                                        {editingSection === currentSection ? 'Editing Mode' : `${currentSection + 1} of ${sections.length}`}
                                    </p>
                                </div>
                                {editingSection === null && hasPermission(permissions, PERMISSIONS.CAR_UPDATE) &&
                                    (<button
                                        onClick={() => startEdit(currentSection)}
                                        className="ml-2 p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                        title="Edit section"
                                        style={{
                                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                                        }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Save/Cancel Buttons */}
                            {editingSection === currentSection && (
                                <div className="flex justify-center space-x-3 mb-6">
                                    <button
                                        onClick={saveEdit}
                                        className="px-6 py-2.5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-sm font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        style={{
                                            boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.4), 0 2px 4px -1px rgba(34, 197, 94, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)'
                                        }}
                                    >
                                        💾 Save Changes
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="px-6 py-2.5 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 text-sm font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        style={{
                                            boxShadow: '0 4px 6px -1px rgba(107, 114, 128, 0.4), 0 2px 4px -1px rgba(107, 114, 128, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)'
                                        }}
                                    >
                                        ✕ Cancel
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
                                            <div
                                                className={`${section.color} rounded-lg p-4 min-h-[300px] transition-all duration-300 ${
                                                    editingSection === index
                                                        ? 'ring-2 ring-blue-400 shadow-2xl'
                                                        : 'shadow-md'
                                                }`}
                                                style={editingSection === index ? {
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%)',
                                                    boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 10px 10px -5px rgba(59, 130, 246, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.05)'
                                                } : {}}
                                            >
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

        {/* View Customer Modal (View Mode) */}
        {showViewCustomerModal && (
            loadingCustomer ? (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-gray-700">Loading customer details...</span>
                        </div>
                    </div>
                </div>
            ) : selectedCustomer ? (
                <ViewCustomerModal
                    customer={selectedCustomer}
                    onClose={handleCloseViewCustomerModal}
                />
            ) : null
        )}

        {/* Select Customer Modal (Edit Mode) */}
        {showSelectCustomerModal && (
            <SelectCustomerModal
                currentCustomerId={editedData.sales?.customer_id || sales.current.customer_id}
                onSelect={handleSelectCustomer}
                onClose={handleCloseSelectCustomerModal}
            />
        )}

        {/* Select Supplier Modal (Edit Mode) */}
        {showSelectSupplierModal && (
            <SelectSupplierModal
                currentSupplierId={editedData.purchase?.supplier_id || purchase.current.supplier_id}
                onSelect={handleSelectSupplier}
                onClose={handleCloseSelectSupplierModal}
            />
        )}

        {/* Shipping History Modal */}
        {showShippingHistory && (
            <ShippingHistory
                vehicleId={id}
                onClose={() => setShowShippingHistory(false)}
            />
        )}

        {/* Purchase History Modal */}
        {showPurchaseHistory && (
            <PurchaseHistory
                vehicleId={id}
                onClose={() => setShowPurchaseHistory(false)}
            />
        )}

        {/* Image Viewer */}
        {showImageViewer && (
            <ImageViewer
                images={imageUrls}
                initialIndex={currentImageIndex}
                onClose={() => setShowImageViewer(false)}
            />
        )}
        </>
    );
};

export default SelectedCarCard;