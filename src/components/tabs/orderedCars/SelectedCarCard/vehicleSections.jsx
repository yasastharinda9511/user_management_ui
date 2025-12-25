import React from 'react';
import { SELECTED_VEHICLE_CARD_OPTIONS } from "../../../common/Costants.js";
import {RESOURCES, ACTIONS} from "../../../../utils/resources.js";
import {hasPermission} from "../../../../utils/permissionUtils.js";
import DocumentsSection from "./DocumentsSection.jsx";
import CarInformationSection from "./CarInformationSection.jsx";
import ShippingDetailsSection from "./ShippingDetailsSection.jsx";
import PurchaseDetailsSection from "./PurchaseDetailsSection.jsx";
import SalesInformationSection from "./SalesInformationSection.jsx";
import FinancialSummarySection from "./FinancialSummarySection.jsx";

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
    showNotification,
    onSelectChangeCustomer,
    onSelectChangeSupplier,
    onShowPurchaseHistory,
    onShowShippingHistory,
    vehicleId
}) => {

    const carInfoSection = [
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.VEHICLE_INFORMATION,
            color: "bg-gray-50",
            sectionKey: "vehicle",
            requiredPermission: `${RESOURCES.CAR}.${ACTIONS.ACCESS}`,
            content: <CarInformationSection editedData={editedData} updateField={updateField} editingSection={editingSection} vehicle={vehicle} />
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.SHIPPING_DETAILS,
            color: "bg-yellow-50",
            sectionKey: "shipping",
            requiredPermission: `${RESOURCES.SHIPPING}.${ACTIONS.ACCESS}`,
            content: (<ShippingDetailsSection editedData={editedData} updateField={updateField} editingSection={editingSection} shipping={shipping} onShowShippingHistory={onShowShippingHistory} />)
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.PURCHASE_DETAILS,
            color: "bg-indigo-50",
            sectionKey: "purchase",
            requiredPermission: `${RESOURCES.PURCHASE}.${ACTIONS.ACCESS}`,
            content: (<PurchaseDetailsSection editedData={editedData} updateField={updateField} editingSection={editingSection} purchase={purchase} onSelectChangeSupplier={onSelectChangeSupplier} onShowPurchaseHistory={onShowPurchaseHistory}/>)
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.FINANCIAL_SUMMARY,
            color: "bg-green-50",
            sectionKey: "financials",
            requiredPermission: `${RESOURCES.FINANCIAL}.${ACTIONS.ACCESS}`,
            content: (<FinancialSummarySection editedData={editedData} updateField={updateField} editingSection={editingSection} financials={financials}/>)
        },
        {
            title: SELECTED_VEHICLE_CARD_OPTIONS.SALES_INFORMATION,
            color: "bg-purple-50",
            sectionKey: "sales",
            requiredPermission: `${RESOURCES.SALES}.${ACTIONS.ACCESS}`,
            content: (<SalesInformationSection editedData={editedData} editingSection={editingSection} sales={sales} updateField={updateField} onSelectChangeCustomer={onSelectChangeCustomer} />)
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
