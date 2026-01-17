import React, { useState, useRef, useEffect, useCallback } from "react";
import {useDispatch, useSelector} from "react-redux";
import { Plus, History, Download, ShoppingCart, Star } from 'lucide-react';
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
import presignedUrlCache from "../../../../utils/presignedUrlCache.js";
import SelectCustomerModal from "../SelectCustomerModal.jsx";
import SelectSupplierModal from "../SelectSupplierModal.jsx";
import ViewCustomerModal from "../ViewCustomerModal.jsx";
import ImageViewer from "../../../common/ImageViewer.jsx";
import ShippingHistory from "../ShippingHistory.jsx";
import PurchaseHistory from "../PurchaseHistory.jsx";
import ShareButton from "../../../common/ShareButton.jsx";
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
    const [makeLogoUrl, setMakeLogoUrl] = useState(null);
    const [loadingMakeLogo, setLoadingMakeLogo] = useState(false);

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

    // Fetch make logo
    useEffect(() => {
        const fetchMakeLogo = async () => {
            if (!selectedCar?.vehicle?.make_id) {
                setMakeLogoUrl(null);
                return;
            }

            try {
                setLoadingMakeLogo(true);
                const url = await presignedUrlCache.getCachedMakeLogo(selectedCar.vehicle.make_id);
                setMakeLogoUrl(url);
            } catch (error) {
                console.error('Error fetching make logo:', error);
                setMakeLogoUrl(null);
            } finally {
                setLoadingMakeLogo(false);
            }
        };

        fetchMakeLogo();
    }, [selectedCar?.vehicle?.make_id])

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
            // Sort by: primary first, then by display_order
            const sortedImages = images.sort((a, b) => {
                // Primary images come first
                if (a.is_primary && !b.is_primary) return -1;
                if (!a.is_primary && b.is_primary) return 1;
                // If both primary or both not primary, sort by display_order
                return a.display_order - b.display_order;
            });

            const urls = await Promise.all(
                sortedImages.map(async (img) => {
                    try {
                        const url = await presignedUrlCache.getCachedVehicleImage(img.vehicle_id, img.filename);
                        return { url: url || null, imageData: img };
                    } catch (error) {
                        console.error('Error fetching vehicle image', img.filename, error);
                        return null;
                    }
                })
            );

            // Filter out failed (null) results
            setImageUrls(urls.filter(item => item && item.url));
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

            // Invalidate cache for this vehicle's images
            presignedUrlCache.invalidateVehicleImages(vehicle.current.id);

            // Refresh images after upload
            const images = [...selectedCar.vehicle_image];
            const sortedImages = images.sort((a, b) => a.display_order - b.display_order);

            const urls = await Promise.all(
                sortedImages.map(async (img) => {
                    try {
                        const url = await presignedUrlCache.getCachedVehicleImage(img.vehicle_id, img.filename);
                        return url || null;
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

    // Callback to refresh vehicle data after document changes
    const handleDocumentsChange = useCallback(() => {
        dispatch(fetchVehicleById(id));
    }, [dispatch, id]);

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
            onDocumentsChange: handleDocumentsChange,
            vehicleId: id
        }));
    }, [editingSection, editedData, handleDocumentsChange])
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

        // Calculate initial profit
        const revenue = parseFloat(sales.current?.revenue) || 0;
        const totalCost = parseFloat(financials.current?.total_cost_lkr) || 0;
        const calculatedProfit = revenue - totalCost;

        console.log('Initial Profit Calculation:', {
            revenue,
            totalCost,
            calculatedProfit
        });

        setEditedData({
            vehicle: { ...vehicle.current },
            shipping: { ...shipping.current },
            financials: { ...financials.current },
            sales: { ...sales.current, profit: calculatedProfit },
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
                        ["financials"]: editedData.financials,
                        ["sales"]: editedData.sales,
                    }));
                    showNotification('success', 'Success', `${SELECTED_VEHICLE_CARD_OPTIONS.PURCHASE_DETAILS} Updated Successfully`);
                    break;

                case SELECTED_VEHICLE_CARD_OPTIONS.FINANCIAL_SUMMARY:
                    await dispatch(updateVehicleFinancials({
                        vehicleId: vehicle.current.id,
                        financialData: editedData.financials,
                    })).unwrap();
                    await dispatch(updateVehicle({
                        vehicleId: vehicle.current.id,
                        updateData: editedData.vehicle,
                    })).unwrap();
                    setOriginalData(prev =>({
                        ...prev,
                        ["vehicle"]: editedData.vehicle,
                        ["financials"]: editedData.financials,
                        ["sales"]: editedData.sales,
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

            // Create updated data with the new section
            const updatedData = {
                ...prev,
                [section]: updatedSection,
            };

            // Recalculate total cost when financials or purchase sections are updated
            if (section === "financials" || section === "purchase") {
                const financialsToUse = section === "financials" ? updatedSection : prev.financials;
                const purchaseToUse = section === "purchase" ? updatedSection : prev.purchase;

                const newTotalCost = calculateTotalCost(financialsToUse, purchaseToUse);
                updatedData.financials = {
                    ...financialsToUse,
                    total_cost_lkr: newTotalCost
                };

                // Recalculate profit when total cost changes
                const revenue = parseFloat(prev.sales?.revenue) || 0;
                const calculatedProfit = revenue - newTotalCost;
                updatedData.sales = {
                    ...prev.sales,
                    profit: calculatedProfit
                };

                console.log('Profit Recalculation (cost change):', {
                    section,
                    field,
                    revenue,
                    newTotalCost,
                    calculatedProfit
                });
            }

            // Recalculate profit when revenue is updated in sales section
            if (section === "sales" && field === "revenue") {
                const totalCost = parseFloat(prev.financials?.total_cost_lkr) || 0;
                const revenue = parseFloat(value) || 0;
                const calculatedProfit = revenue - totalCost;
                updatedData.sales = {
                    ...updatedSection,
                    profit: calculatedProfit
                };

                console.log('Profit Recalculation (revenue change):', {
                    revenue,
                    totalCost,
                    calculatedProfit
                });
            }

            return updatedData;
        });
    }, []);

    const calculateTotalCost = (financials, purchase) => {
        const tt_charges = parseFloat(financials?.tt_lkr) || 0;
        const charges = parseFloat(financials?.charges_lkr) || 0;
        const duty = parseFloat(financials?.duty_lkr) || 0;
        const clearing = parseFloat(financials?.clearing_lkr) || 0;
        const lc_cost_jpy = parseFloat(purchase?.lc_cost_jpy) || 0;
        const exchange_rate = parseFloat(purchase?.exchange_rate) || 0;

        // Convert LC cost from JPY to LKR using exchange rate
        const lc_cost_lkr = lc_cost_jpy * exchange_rate;

        // Handle other_expenses_lkr as JSON object or number
        let otherExpenses = 0;
        if (financials?.other_expenses_lkr) {
            if (typeof financials.other_expenses_lkr === 'object') {
                // Sum all values in the JSON object
                otherExpenses = Object.values(financials.other_expenses_lkr).reduce(
                    (sum, val) => sum + (parseFloat(val) || 0),
                    0
                );
            } else {
                // Handle old format where it's a single number
                otherExpenses = parseFloat(financials.other_expenses_lkr) || 0;
            }
        }

        console.log('Total Cost Breakdown:', {
            tt_charges,
            charges,
            duty,
            clearing,
            lc_cost_jpy,
            exchange_rate,
            lc_cost_lkr,
            otherExpenses,
            total: tt_charges + charges + duty + clearing + lc_cost_lkr + otherExpenses
        });

        return tt_charges + charges + duty + clearing + lc_cost_lkr + otherExpenses;
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

    const handleSetAsPrimary = async (imageId, index) => {
        try {
            setLoadingImages(true);
            await vehicleService.setImageAsPrimary(vehicle.current.id, imageId);
            showNotification('success', 'Success', 'Primary image updated successfully');

            // Invalidate cache and refresh vehicle data
            presignedUrlCache.invalidateVehicleImages(vehicle.current.id);
            await dispatch(fetchVehicleById(id));

            // Set the newly primary image as the current image
            setCurrentImageIndex(0); // Primary image will be first after re-sort
        } catch (error) {
            console.error('Error setting primary image:', error);
            showNotification('error', 'Error', 'Failed to set primary image: ' + error.message);
            setLoadingImages(false);
        }
    };

    const handleDownloadImage = async (imageIndex = null) => {
        try {
            const index = imageIndex !== null ? imageIndex : currentImageIndex;
            const imageItem = imageUrls[index];
            const response = await fetch(imageItem.url);
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
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {`${selectedCar?.vehicle?.code} | ${selectedCar?.vehicle?.make} | ${selectedCar?.vehicle?.model}`}
                            </h2>
                            <button
                                onClick={() => setShowShippingHistory(true)}
                                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                title="View shipping history"
                            >
                                <History className="w-3.5 h-3.5" />
                                <span>Shipping</span>
                            </button>
                            <button
                                onClick={() => setShowPurchaseHistory(true)}
                                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                title="View purchase history"
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Purchase</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShareButton
                                vehicleId={id}
                                vehicleData={selectedCar}
                                variant="button"
                            />
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Vehicle Image and Basic Info */}
                        <div>
                            {/* Image Container with Swipe */}
                            <div className="relative mb-4 group">
                                <div
                                    ref={imageContainerRef}
                                    className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
                                    onTouchStart={onImageTouchStart}
                                    onTouchMove={onImageTouchMove}
                                    onTouchEnd={onImageTouchEnd}
                                >
                                    {loadingImages ? (
                                        <div className="w-full h-64 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={imageUrls[currentImageIndex]?.url}
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
                                    {imageUrls.length > 0 && imageUrls.map((imageItem, index) => (
                                        <div
                                            key={index}
                                            className={`group relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                                index === currentImageIndex
                                                    ? 'border-blue-600 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800'
                                                    : imageItem.imageData.is_primary
                                                    ? 'border-yellow-500 dark:border-yellow-400 ring-2 ring-yellow-200 dark:ring-yellow-800'
                                                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                            }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        >
                                            <img
                                                src={imageItem.url}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Primary Badge */}
                                            {imageItem.imageData.is_primary && (
                                                <div className="absolute top-0.5 left-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[10px] px-1 py-0.5 rounded flex items-center gap-0.5 shadow-md">
                                                    <Star className="w-2 h-2 fill-white" />
                                                    <span className="font-bold">Primary</span>
                                                </div>
                                            )}

                                            {/* Action Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownloadImage(index);
                                                    }}
                                                    className="p-1.5 bg-white/90 hover:bg-white rounded-full text-blue-600 transition-all transform hover:scale-110 shadow-lg"
                                                    title="Download this image"
                                                >
                                                    <Download className="w-3 h-3" />
                                                </button>
                                                {!imageItem.imageData.is_primary && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSetAsPrimary(imageItem.imageData.id, index);
                                                        }}
                                                        className="p-1.5 bg-yellow-500/90 hover:bg-yellow-500 rounded-full text-white transition-all transform hover:scale-110 shadow-lg"
                                                        title="Set as primary image"
                                                    >
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Image Button */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all flex items-center justify-center bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Add images"
                                    >
                                        {uploading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
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
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {editedData.vehicle?.make || vehicle.current.make} {editedData.vehicle?.model || vehicle.current.model}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(editedData.shipping?.shipping_status || shipping.current.shipping_status)}`}>
                                        {editedData.shipping?.shipping_status || shipping.current.shipping_status || 'PROCESSING'}
                                    </span>
                                    {(editedData.vehicle?.is_featured || vehicle.current.is_featured) && (
                                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-white flex items-center gap-1.5 shadow-md">
                                            <Star className="w-3.5 h-3.5 fill-white" />
                                            Featured
                                        </span>
                                    )}
                                </div>

                                {/* Price Labels */}
                                <div className="flex items-center gap-2 flex-wrap pt-2">
                                    <span className="px-3 py-1 text-sm font-medium rounded-full border bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                                        Auction: {(editedData.vehicle?.currency || vehicle.current.currency || 'LKR')} {(editedData.vehicle?.auction_price || 0)?.toLocaleString()}
                                    </span>
                                    <span className="px-3 py-1 text-sm font-medium rounded-full border bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                                        Quoted: LKR {(editedData.vehicle?.price_quoted || 0)?.toLocaleString()}
                                    </span>

                                </div>
                            </div>

                            {/* Make Logo */}
                            {makeLogoUrl && (
                                <div className="flex items-start pt-4">
                                    <div className="w-20 h-20 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2">
                                        {loadingMakeLogo ? (
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                                        ) : (
                                            <img
                                                src={makeLogoUrl}
                                                alt={`${editedData.vehicle?.make || vehicle.current.make} logo`}
                                                className="max-w-full max-h-full object-contain"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
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
                                            index === currentSection ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'
                                        } ${editingSection !== null ? 'cursor-not-allowed opacity-50' : ''}`}
                                    />
                                ))}
                            </div>

                            {/* Section Title and Edit Button */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-center flex-1">
                                    <h4 className={`font-semibold text-lg transition-all ${
                                        editingSection === currentSection
                                            ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent'
                                            : 'text-gray-900 dark:text-white'
                                    }`}>
                                        {editingSection === currentSection && '✏️ '}
                                        {sections[currentSection]?.title}
                                    </h4>
                                    <p className={`text-sm transition-colors ${
                                        editingSection === currentSection ? 'text-blue-500 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'
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

                            {/* Save/Cancel Buttons - Show Done button for Documents section since documents save immediately */}
                            {editingSection === currentSection && (
                                <div className="flex justify-center space-x-3 mb-6">
                                    {sections[currentSection]?.title === SELECTED_VEHICLE_CARD_OPTIONS.DOCUMENTS ? (
                                        <button
                                            onClick={cancelEdit}
                                            className="px-6 py-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                                            style={{
                                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4), 0 2px 4px -1px rgba(59, 130, 246, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)'
                                            }}
                                        >
                                            ✓ Done
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={saveEdit}
                                                className="px-6 py-2.5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-sm font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                                                style={{
                                                    boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.4), 0 2px 4px -1px rgba(34, 197, 94, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)'
                                                }}
                                            >
                                                💾 Save
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
                                        </>
                                    )}
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
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                    }`}
                                >
                                    ← Previous
                                </button>

                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {editingSection !== null ? 'Editing mode' : 'Swipe to navigate'}
                                </span>

                                <button
                                    onClick={nextSection}
                                    disabled={currentSection === sections.length - 1 || editingSection !== null}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        currentSection === sections.length - 1 || editingSection !== null
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
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
                <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                            <span className="text-gray-700 dark:text-gray-300">Loading customer details...</span>
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
                images={imageUrls.map(item => item.url)}
                initialIndex={currentImageIndex}
                onClose={() => setShowImageViewer(false)}
            />
        )}
        </>
    );
};

export default SelectedCarCard;