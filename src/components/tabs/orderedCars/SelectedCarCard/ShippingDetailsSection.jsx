import EditableField from "../EditableField.jsx";
import {formatDate} from "../../../../utils/common.js";


const ShippingDetailsSection = ({editedData, editingSection, shipping, updateField}) =>{

    return(
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
    );

}


export default ShippingDetailsSection;