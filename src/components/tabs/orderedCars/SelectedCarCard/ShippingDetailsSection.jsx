import EditableField from "../EditableField.jsx";
import {formatDate} from "../../../../utils/common.js";
import {History} from "lucide-react";


const ShippingDetailsSection = ({editedData, editingSection, shipping, updateField, onShowShippingHistory}) =>{

    return(
        <div className="space-y-3">
            {/* Shipping History Button */}
            {onShowShippingHistory && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={onShowShippingHistory}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        type="button"
                    >
                        <History className="w-4 h-4 mr-2" />
                        View Shipping History
                    </button>
                </div>
            )}

            <EditableField
                label="Vessel"
                value={editedData.shipping?.vessel_name }
                section="shipping"
                field="vessel_name"
                isEditing={editingSection !== null}
                currentValue={editedData.shipping?.vessel_name || ''}
                updateField={updateField}
            />
            <EditableField
                label="Departure Port"
                value={editedData.shipping?.departure_harbour }
                section="shipping"
                field="departure_harbour"
                isEditing={editingSection !== null}
                currentValue={editedData.shipping?.departure_harbour || ''}
                updateField={updateField}
            />
            <EditableField
                label="Shipped Date"
                value={formatDate(editedData.shipping?.shipment_date )}
                section="shipping"
                field="shipment_date"
                type="date"
                isEditing={editingSection !== null}
                currentValue={editedData.shipping?.shipment_date || ''}
                updateField={updateField}
            />
            <EditableField
                label="Arrival Date"
                value={formatDate(editedData.shipping?.arrival_date)}
                section="shipping"
                field="arrival_date"
                type="date"
                isEditing={editingSection !== null}
                currentValue={editedData.shipping?.arrival_date || ''}
                updateField={updateField}
            />
            <EditableField
                label="Clearing Date"
                value={formatDate(editedData.shipping?.clearing_date)}
                section="shipping"
                field="clearing_date"
                type="date"
                isEditing={editingSection !== null}
                currentValue={editedData.shipping?.clearing_date || ''}
                updateField={updateField}
            />
            <EditableField
                label="Shipping Status"
                value={editedData.shipping?.shipping_status }
                section="shipping"
                field="shipping_status"
                options={['PROCESSING', 'SHIPPED', 'ARRIVED', 'CLEARED', 'DELIVERED']}
                isEditing={editingSection !== null}
                currentValue={editedData.shipping?.shipping_status || 'PROCESSING'}
                updateField={updateField}
            />
        </div>
    );

}


export default ShippingDetailsSection;