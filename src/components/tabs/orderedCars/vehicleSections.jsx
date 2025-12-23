import React from 'react';
import { Eye } from 'lucide-react';
import { SELECTED_VEHICLE_CARD_OPTIONS } from "../../common/Costants.js";
import EditableField from "./EditableField.jsx";
import {PERMISSIONS} from "../../../utils/permissions.js";
import {RESOURCES, ACTIONS} from "../../../utils/resources.js";
import {hasPermission} from "../../../utils/permissionUtils.js";
import {useSelector} from "react-redux";
import {selectPermissions} from "../../../state/authSlice.js";
import DocumentsSection from "./DocumentsSection.jsx";

/**
 * Get vehicle sections configuration for SelectedCarCard
 * @param {Object} params - Parameters for sections
 * @param {Object} params.editedData - Current edited data
 * @param {Object} params.vehicle - Vehicle data
 * @param {Object} params.shipping - Shipping data
 * @param {Object} params.financials - Financial data
 * @param {Object} params.sales - Sales data
 * @param {Object} params.purchase - Purchase data
 * @param {Object} params.editingSection - Currently editing section
 * @param {Function} params.updateField - Update field function
 * @param {Function} params.formatDate - Format date function
 * @param {Function} params.formatCurrency - Format currency function
 * @returns {Array} - Array of section configurations
 */
export const VehicleSections = ({
    permissions,
    editedData,
    vehicle,
    shipping,
    financials,
    sales,
    purchase,
    documents,
    editingSection,
    updateField,
    formatDate,
    formatCurrency,
    onViewCustomer,
    onSelectChangeCustomer,
    vehicleId
}) => {

    const carInfoSection = [
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.VEHICLE_INFORMATION,
            color: "bg-gray-50",
            sectionKey: "vehicle",
            requiredPermission: `${RESOURCES.CAR}.${ACTIONS.ACCESS}`,
            content: (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    <EditableField
                        label="Make"
                        value={editedData.vehicle?.make || vehicle.make}
                        section="vehicle"
                        field="make"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.make || vehicle.make || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Model"
                        value={editedData.vehicle?.model || vehicle.model}
                        section="vehicle"
                        field="model"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.model || vehicle.model || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Year"
                        value={editedData.vehicle?.year_of_manufacture || vehicle.year_of_manufacture}
                        section="vehicle"
                        field="year_of_manufacture"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.year_of_manufacture || vehicle.year_of_manufacture || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Color"
                        value={editedData.vehicle?.color || vehicle.color}
                        section="vehicle"
                        field="color"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.color || vehicle.color || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Trim Level"
                        value={editedData.vehicle?.trim_level || vehicle.trim_level}
                        section="vehicle"
                        field="trim_level"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.trim_level || vehicle.trim_level || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Mileage (km)"
                        value={editedData.vehicle?.mileage_km ? `${editedData.vehicle.mileage_km.toLocaleString()} km` : (vehicle.mileage_km ? `${vehicle.mileage_km.toLocaleString()} km` : 'N/A')}
                        section="vehicle"
                        field="mileage_km"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.mileage_km || vehicle.mileage_km || 0}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Condition"
                        value={editedData.vehicle?.condition_status || vehicle.condition_status}
                        section="vehicle"
                        field="condition_status"
                        options={['REGISTERED', 'UNREGISTERED']}
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.condition_status || vehicle.condition_status || 'UNREGISTERED'}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Auction Grade"
                        value={editedData.vehicle?.auction_grade || vehicle.auction_grade}
                        section="vehicle"
                        field="auction_grade"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.auction_grade || vehicle.auction_grade || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Vehicle Code"
                        value={`ORD-${editedData.vehicle?.code || vehicle.code || 'N/A'}`}
                        section="vehicle"
                        field="code"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.code || vehicle.code || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Chassis Number"
                        value={editedData.vehicle?.chassis_id || vehicle.chassis_id}
                        section="vehicle"
                        field="chassis_id"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.chassis_id || vehicle.chassis_id || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Vehicle ID"
                        value={editedData.vehicle?.id || vehicle.id}
                        section="vehicle"
                        field="id"
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.id || vehicle.id || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Currency"
                        value={editedData.vehicle?.currency || vehicle.currency}
                        section="vehicle"
                        field="currency"
                        options={['JPY', 'USD', 'LKR', 'EUR']}
                        isEditing={editingSection !== null}
                        currentValue={editedData.vehicle?.currency || vehicle.currency || 'LKR'}
                        updateField={updateField}
                    />
                </div>
            )
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.SHIPPING_DETAILS,
            color: "bg-yellow-50",
            sectionKey: "shipping",
            requiredPermission: `${RESOURCES.SHIPPING}.${ACTIONS.ACCESS}`,
            content: (
                <div className="space-y-3">
                    <EditableField
                        label="Vessel"
                        value={editedData.shipping?.vessel_name || shipping.vessel_name}
                        section="shipping"
                        field="vessel_name"
                        isEditing={editingSection !== null}
                        currentValue={editedData.shipping?.vessel_name || shipping.vessel_name || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Departure Port"
                        value={editedData.shipping?.departure_harbour || shipping.departure_harbour}
                        section="shipping"
                        field="departure_harbour"
                        isEditing={editingSection !== null}
                        currentValue={editedData.shipping?.departure_harbour || shipping.departure_harbour || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Shipped Date"
                        value={formatDate(editedData.shipping?.shipment_date || shipping.shipment_date)}
                        section="shipping"
                        field="shipment_date"
                        type="date"
                        isEditing={editingSection !== null}
                        currentValue={editedData.shipping?.shipment_date || shipping.shipment_date || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Arrival Date"
                        value={formatDate(editedData.shipping?.arrival_date || shipping.arrival_date)}
                        section="shipping"
                        field="arrival_date"
                        type="date"
                        isEditing={editingSection !== null}
                        currentValue={editedData.shipping?.arrival_date || shipping.arrival_date || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Clearing Date"
                        value={formatDate(editedData.shipping?.clearing_date || shipping.clearing_date)}
                        section="shipping"
                        field="clearing_date"
                        type="date"
                        isEditing={editingSection !== null}
                        currentValue={editedData.shipping?.clearing_date || shipping.clearing_date || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Shipping Status"
                        value={editedData.shipping?.shipping_status || shipping.shipping_status}
                        section="shipping"
                        field="shipping_status"
                        options={['PROCESSING', 'SHIPPED', 'ARRIVED', 'CLEARED', 'DELIVERED']}
                        isEditing={editingSection !== null}
                        currentValue={editedData.shipping?.shipping_status || shipping.shipping_status || 'PROCESSING'}
                        updateField={updateField}
                    />
                </div>
            )
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.PURCHASE_DETAILS,
            color: "bg-indigo-50",
            sectionKey: "purchase",
            requiredPermission: `${RESOURCES.PURCHASE}.${ACTIONS.ACCESS}`,
            content: (
                <div className="space-y-3">
                    <EditableField
                        label="Purchase Date"
                        value={formatDate(editedData.purchase?.purchase_date || purchase.purchase_date)}
                        section="purchase"
                        field="purchase_date"
                        type="date"
                        isEditing={editingSection !== null}
                        currentValue={editedData.purchase?.purchase_date || purchase.purchase_date || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="LC Cost (JPY)"
                        value={formatCurrency(editedData.purchase?.lc_cost_jpy || purchase.lc_cost_jpy, 'JPY')}
                        section="purchase"
                        field="lc_cost_jpy"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.purchase?.lc_cost_jpy || purchase.lc_cost_jpy || 0}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Purchase Remarks"
                        value={editedData.purchase?.purchase_remarks || purchase.purchase_remarks}
                        section="purchase"
                        field="purchase_remarks"
                        type="textarea"
                        isEditing={editingSection !== null}
                        currentValue={editedData.purchase?.purchase_remarks || purchase.purchase_remarks || ''}
                        updateField={updateField}
                    />
                </div>
            )
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.FINANCIAL_SUMMARY,
            color: "bg-green-50",
            sectionKey: "financials",
            requiredPermission: `${RESOURCES.FINANCIAL}.${ACTIONS.ACCESS}`,
            content: (
                <div className="space-y-3">
                    <EditableField
                        label="TT"
                        value={formatCurrency(editedData.financials?.tt_lkr || financials.tt_lkr)}
                        section="financials"
                        field="tt_lkr"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.financials?.tt_lkr || financials.tt_lkr || 0}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Charges (LKR)"
                        value={formatCurrency(editedData.financials?.charges_lkr || financials.charges_lkr)}
                        section="financials"
                        field="charges_lkr"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.financials?.charges_lkr || financials.charges_lkr || 0}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Duty (LKR)"
                        value={formatCurrency(editedData.financials?.duty_lkr || financials.duty_lkr)}
                        section="financials"
                        field="duty_lkr"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.financials?.duty_lkr || financials.duty_lkr || 0}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Clearing (LKR)"
                        value={formatCurrency(editedData.financials?.clearing_lkr || financials.clearing_lkr)}
                        section="financials"
                        field="clearing_lkr"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.financials?.clearing_lkr || financials.clearing_lkr || 0}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Other Expenses (LKR)"
                        value={formatCurrency(editedData.financials?.other_expenses_lkr || 0)}
                        section="financials"
                        field="other_expenses_lkr"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.financials?.other_expenses_lkr || 0}
                        updateField={updateField}
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
            requiredPermission: `${RESOURCES.SALES}.${ACTIONS.ACCESS}`,
            content: (
                <div className="space-y-3">
                    <EditableField
                        label="Sale Status"
                        value={editedData.sales?.sale_status || sales.sale_status || 'AVAILABLE'}
                        section="sales"
                        field="sale_status"
                        options={['AVAILABLE', 'SOLD', 'RESERVED']}
                        isEditing={editingSection !== null}
                        currentValue={editedData.sales?.sale_status || sales.sale_status || 'AVAILABLE'}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Sold Date"
                        value={formatDate(editedData.sales?.sold_date || sales.sold_date)}
                        section="sales"
                        field="sold_date"
                        type="date"
                        isEditing={editingSection !== null}
                        currentValue={editedData.sales?.sold_date || sales.sold_date || ''}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Revenue (LKR)"
                        value={formatCurrency(editedData.sales?.revenue || sales.revenue)}
                        section="sales"
                        field="revenue"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.sales?.revenue || sales.revenue || 0}
                        updateField={updateField}
                    />
                    <EditableField
                        label="Profit (LKR)"
                        value={formatCurrency(editedData.sales?.profit || sales.profit)}
                        section="sales"
                        field="profit"
                        type="number"
                        isEditing={editingSection !== null}
                        currentValue={editedData.sales?.profit || sales.profit || 0}
                        updateField={updateField}
                    />

                    {/* Customer Information */}
                    <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-700">Customer Information</span>
                            {(editedData.sales?.customer_id || sales.customer_id) && (
                                editingSection !== null ? (
                                    // Edit mode - show select/change button
                                    onSelectChangeCustomer && (
                                        <button
                                            onClick={onSelectChangeCustomer}
                                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                            type="button"
                                        >
                                            Select/Change Customer
                                        </button>
                                    )
                                ) : (
                                    // View mode - show eye icon to view details
                                    onViewCustomer && (
                                        <button
                                            onClick={() => onViewCustomer(editedData.sales?.customer_id || sales.customer_id)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            type="button"
                                            title="View customer details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    )
                                )
                            )}
                            {!(editedData.sales?.customer_id || sales.customer_id) && editingSection !== null && onSelectChangeCustomer && (
                                <button
                                    onClick={onSelectChangeCustomer}
                                    className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                    type="button"
                                >
                                    Assign Customer
                                </button>
                            )}
                        </div>
                        <EditableField
                            label="Customer ID"
                            value={editedData.sales?.customer_id || sales.customer_id || 'Not assigned'}
                            section="sales"
                            field="customer_id"
                            type="number"
                            isEditing={editingSection !== null}
                            currentValue={editedData.sales?.customer_id || sales.customer_id || ''}
                            updateField={updateField}
                        />
                        {(editedData.sales?.customer_id || sales.customer_id) ? (
                            <p className="text-xs text-gray-500 mt-1">
                                {editingSection !== null ? 'Click the button above to change the customer' : 'Click the eye icon to view customer details'}
                            </p>
                        ) : editingSection !== null && (
                            <p className="text-xs text-gray-500 mt-1">
                                Click "Assign Customer" to select a customer for this sale
                            </p>
                        )}
                    </div>

                    <EditableField
                        label="Sale Remarks"
                        value={editedData.sales?.sale_remarks || sales.sale_remarks}
                        section="sales"
                        field="sale_remarks"
                        type="textarea"
                        isEditing={editingSection !== null}
                        currentValue={editedData.sales?.sale_remarks || sales.sale_remarks || ''}
                        updateField={updateField}
                    />
                </div>
            )
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.DOCUMENTS,
            color: "bg-indigo-50",
            sectionKey: "documents",
            requiredPermission: `${RESOURCES.CAR}.${ACTIONS.ACCESS}`,
            content: (
                <div className="space-y-3">
                    <DocumentsSection
                        vehicleId={vehicleId}
                        allDocuments={documents}
                        isEditing={editingSection !== null}
                    />
                </div>
            )
        }
    ]

    return carInfoSection.filter(section => {
        return hasPermission(permissions, section.requiredPermission);
    })
};
