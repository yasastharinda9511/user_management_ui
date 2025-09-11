import React, { useState, useRef, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchVehicles,
    selectCurrentPage,
    selectShouldRefresh,
    selectUpdating,
    updateVehicle,
    updateVehicleFinancials, updateVehiclePurchase,
    updateVehicleShipping
} from "../../../state/vehicleSlice.js";
import Notification from "../../common/Notification.jsx"
import {SELECTED_VEHICLE_CARD_OPTIONS} from "../../common/Costants.js";
import config from "../../../configs/config.json";

const SelectedCarCard = ({selectedCar, closeModal, onSave}) => {
    const dispatch = useDispatch();
    const [currentSection, setCurrentSection] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const containerRef = useRef(null);
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });


    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

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

    const updateField = (section, field, value) => {

        const updatedSection = {
            ...editedData[section],
            [field]: value
        }

        if (section === "financials"){
            updatedSection.total_cost_lkr = calculateTotalCost(updatedSection);
        }

        setEditedData(prev => ({
            ...prev,
            [section]: updatedSection,
        }));
    };

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

    const EditableField = ({ label, value, section, field, type = "text", options = null}) => {
        const isEditing = editingSection !== null;
        const currentValue = editedData[section]?.[field] || value || '';
        const [inputValue, setInputValue] = useState(currentValue.toString());

        if (!isEditing) {
            if (type === "currency") {
                return (
                    <div className="flex justify-between">
                        <span className="text-gray-600">{label}:</span>
                        <span className="font-medium">{value}</span>
                    </div>
                );
            }
            return (
                <div className="flex justify-between">
                    <span className="text-gray-600">{label}:</span>
                    <span className="font-medium">{value || 'N/A'}</span>
                </div>
            );
        }

        return (
            <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{label}:</span>
                <div className="flex-1 ml-2">
                    {options ? (
                        <select
                            value={currentValue}
                            onChange={(e) => updateField(section, field, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : type === "date" ? (
                        <input
                            type="date"
                            value={(currentValue && currentValue !== "N/A")? new Date(currentValue).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                updateField(section, field, e.target.value);
                            }
                        }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : type === "number" ? (
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value); // let user type freely
                            }}
                            onBlur={() => {
                                const num = parseFloat(inputValue);
                                console.log("val" +  num);
                                updateField(section, field, isNaN(num) ? 0 : num);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : type === "textarea" ? (
                        <textarea
                            value={currentValue}
                            onChange={(e) => {
                                updateField(section, field, e.target.value);
                            }
                        }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                        />
                    ) : (
                        <input
                            type="text"
                            value={currentValue}
                            onChange={(e) =>{
                                updateField(section, field, e.target.value);
                            }
                        }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                </div>
            </div>
        );
    };

    // Define sections with editable fields
    const sections = [
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.VEHICLE_INFORMATION,
            color: "bg-gray-50",
            sectionKey: "vehicle",
            content: (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    <EditableField
                        label="Make"
                        value={editedData.vehicle?.make || vehicle.make}
                        section="vehicle"
                        field="make"
                    />
                    <EditableField
                        label="Model"
                        value={editedData.vehicle?.model || vehicle.model}
                        section="vehicle"
                        field="model"
                    />
                    <EditableField
                        label="Year"
                        value={editedData.vehicle?.year_of_manufacture || vehicle.year_of_manufacture}
                        section="vehicle"
                        field="year_of_manufacture"
                        type="number"
                    />
                    <EditableField
                        label="Color"
                        value={editedData.vehicle?.color || vehicle.color}
                        section="vehicle"
                        field="color"
                    />
                    <EditableField
                        label="Trim Level"
                        value={editedData.vehicle?.trim_level || vehicle.trim_level}
                        section="vehicle"
                        field="trim_level"
                    />
                    <EditableField
                        label="Mileage (km)"
                        value={editedData.vehicle?.mileage_km ? `${editedData.vehicle.mileage_km.toLocaleString()} km` : (vehicle.mileage_km ? `${vehicle.mileage_km.toLocaleString()} km` : 'N/A')}
                        section="vehicle"
                        field="mileage_km"
                        type="number"
                    />
                    <EditableField
                        label="Condition"
                        value={editedData.vehicle?.condition_status || vehicle.condition_status}
                        section="vehicle"
                        field="condition_status"
                        options={['REGISTERED', 'UNREGISTERED']}
                    />
                    <EditableField
                        label="Auction Grade"
                        value={editedData.vehicle?.auction_grade || vehicle.auction_grade}
                        section="vehicle"
                        field="auction_grade"
                    />
                    <EditableField
                        label="Vehicle Code"
                        value={`ORD-${editedData.vehicle?.code || vehicle.code || 'N/A'}`}
                        section="vehicle"
                        field="code"
                    />
                    <EditableField
                        label="Chassis Number"
                        value={editedData.vehicle?.chassis_id || vehicle.chassis_id}
                        section="vehicle"
                        field="chassis_id"
                    />
                    <EditableField
                        label="Vehicle ID"
                        value={editedData.vehicle?.id || vehicle.id}
                        section="vehicle"
                        field="id"
                    />
                    <EditableField
                        label="Currency"
                        value={editedData.vehicle?.currency || vehicle.currency}
                        section="vehicle"
                        field="currency"
                        options={['JPY', 'USD', 'LKR', 'EUR']}
                    />
                </div>
            )
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.SHIPPING_DETAILS,
            color: "bg-yellow-50",
            sectionKey: "shipping",
            content: (
                <div className="space-y-3">
                    <EditableField
                        label="Vessel"
                        value={editedData.shipping?.vessel_name || shipping.vessel_name}
                        section="shipping"
                        field="vessel_name"
                    />
                    <EditableField
                        label="Departure Port"
                        value={editedData.shipping?.departure_harbour || shipping.departure_harbour}
                        section="shipping"
                        field="departure_harbour"
                    />
                    <EditableField
                        label="Shipped Date"
                        value={formatDate(editedData.shipping?.shipment_date || shipping.shipment_date)}
                        section="shipping"
                        field="shipment_date"
                        type="date"
                    />
                    <EditableField
                        label="Arrival Date"
                        value={formatDate(editedData.shipping?.arrival_date || shipping.arrival_date)}
                        section="shipping"
                        field="arrival_date"
                        type="date"
                    />
                    <EditableField
                        label="Clearing Date"
                        value={formatDate(editedData.shipping?.clearing_date || shipping.clearing_date)}
                        section="shipping"
                        field="clearing_date"
                        type="date"
                    />
                    <EditableField
                        label="Shipping Status"
                        value={editedData.shipping?.shipping_status || shipping.shipping_status}
                        section="shipping"
                        field="shipping_status"
                        options={['PROCESSING', 'SHIPPED', 'ARRIVED', 'CLEARED', 'DELIVERED']}
                    />
                </div>
            )
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.PURCHASE_DETAILS,
            color: "bg-indigo-50",
            sectionKey: "purchase",
            content: (
                <div className="space-y-3">
                    <EditableField
                        label="Purchase Date"
                        value={formatDate(editedData.purchase?.purchase_date || purchase.purchase_date)}
                        section="purchase"
                        field="purchase_date"
                        type="date"
                    />
                    <EditableField
                        label="LC Cost (JPY)"
                        value={formatCurrency(editedData.purchase?.lc_cost_jpy || purchase.lc_cost_jpy, 'JPY')}
                        section="purchase"
                        field="lc_cost_jpy"
                        type="number"
                    />
                    <EditableField
                        label="Purchase Remarks"
                        value={editedData.purchase?.purchase_remarks || purchase.purchase_remarks}
                        section="purchase"
                        field="purchase_remarks"
                        type="textarea"
                    />
                </div>
            )
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.FINANCIAL_SUMMARY,
            color: "bg-green-50",
            sectionKey: "financials",
            content: (
                <div className="space-y-3">
                    <EditableField
                        label="TT"
                        value={formatCurrency(editedData.financials?.tt_lkr || financials.tt_lkr)}
                        section="financials"
                        field="tt_lkr"
                        type="number"
                    />
                    <EditableField
                        label="Charges (LKR)"
                        value={formatCurrency(editedData.financials?.charges_lkr || financials.charges_lkr)}
                        section="financials"
                        field="charges_lkr"
                        type="number"
                    />
                    <EditableField
                        label="Duty (LKR)"
                        value={formatCurrency(editedData.financials?.duty_lkr || financials.duty_lkr)}
                        section="financials"
                        field="duty_lkr"
                        type="number"
                    />
                    <EditableField
                        label="Clearing (LKR)"
                        value={formatCurrency(editedData.financials?.clearing_lkr || financials.clearing_lkr)}
                        section="financials"
                        field="clearing_lkr"
                        type="number"
                    />
                    <EditableField
                        label="Other Expenses (LKR)"
                        value={formatCurrency(editedData.financials?.other_expenses_lkr || 0)}
                        section="financials"
                        field="other_expenses_lkr"
                        type="number"
                    />
                    <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600 font-semibold">Total Cost:</span>
                        <span className="font-bold text-lg text-green-600">
            {formatCurrency(editedData.financials?.total_cost_lkr || 0)}
        </span>
                    </div>
                </div>
            )
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.SALES_INFORMATION,
            color: "bg-purple-50",
            sectionKey: "sales",
            content: (
                <div className="space-y-3">
                    <EditableField
                        label="Sale Status"
                        value={editedData.sales?.sale_status || sales.sale_status || 'AVAILABLE'}
                        section="sales"
                        field="sale_status"
                        options={['AVAILABLE', 'SOLD', 'RESERVED']}
                    />
                    <EditableField
                        label="Sold Date"
                        value={formatDate(editedData.sales?.sold_date || sales.sold_date)}
                        section="sales"
                        field="sold_date"
                        type="date"
                    />
                    <EditableField
                        label="Revenue (LKR)"
                        value={formatCurrency(editedData.sales?.revenue || sales.revenue)}
                        section="sales"
                        field="revenue"
                        type="number"
                    />
                    <EditableField
                        label="Profit (LKR)"
                        value={formatCurrency(editedData.sales?.profit || sales.profit)}
                        section="sales"
                        field="profit"
                        type="number"
                    />
                    <EditableField
                        label="Customer Title"
                        value={editedData.sales?.sold_to_title || sales.sold_to_title}
                        section="sales"
                        field="sold_to_title"
                        options={['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']}
                    />
                    <EditableField
                        label="Customer Name"
                        value={editedData.sales?.sold_to_name || sales.sold_to_name}
                        section="sales"
                        field="sold_to_name"
                    />
                    <EditableField
                        label="Contact Number"
                        value={editedData.sales?.contact_number || sales.contact_number}
                        section="sales"
                        field="contact_number"
                    />
                    <EditableField
                        label="Customer Address"
                        value={editedData.sales?.customer_address || sales.customer_address}
                        section="sales"
                        field="customer_address"
                        type="textarea"
                    />
                    <EditableField
                        label="Sale Remarks"
                        value={editedData.sales?.sale_remarks || sales.sale_remarks}
                        section="sales"
                        field="sale_remarks"
                        type="textarea"
                    />
                </div>
            )
        }
    ];

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
                            <img
                                src={`${config.car_service.base_url}/vehicles/upload-image/${images.filename}`}
                                alt={`${editedData.vehicle?.make || vehicle.make} ${editedData.vehicle?.model || vehicle.model}`}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/400x250/f3f4f6/6b7280?text=${encodeURIComponent(editedData.vehicle?.make || vehicle.make || 'Car')}+${encodeURIComponent(editedData.vehicle?.model || vehicle.model || 'Model')}`;
                                }}
                            />

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
                                {editingSection === null && (
                                    <button
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