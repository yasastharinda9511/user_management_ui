import {Component} from "react";
import EditableField from "../EditableField.jsx";
import {formatCurrency, formatDate} from "../../../../utils/common.js";

const PurchaseDetailsSection = ({editedData, editingSection, purchase, updateField })=>{

    return (
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
                label="Bought From"
                value={editedData.purchase?.bought_from_name || purchase.bought_from_name}
                section="purchase"
                field="bought_from_name"
                isEditing={editingSection !== null}
                currentValue={editedData.purchase?.bought_from_name || purchase.bought_from_name || ''}
                updateField={updateField}
            />
            <EditableField
                label="Purchase Status"
                value={editedData.purchase?.purchase_status || purchase.purchase_status || 'LC_PENDING'}
                section="purchase"
                field="purchase_status"
                options={['LC_PENDING', 'LC_OPENED', 'LC_RECEIVED', 'CANCELLED']}
                isEditing={editingSection !== null}
                currentValue={editedData.purchase?.purchase_status || purchase.purchase_status || 'LC_PENDING'}
                updateField={updateField}
            />
            <EditableField
                label="LC Bank"
                value={editedData.purchase?.lc_bank || purchase.lc_bank}
                section="purchase"
                field="lc_bank"
                isEditing={editingSection !== null}
                currentValue={editedData.purchase?.lc_bank || purchase.lc_bank || ''}
                updateField={updateField}
            />
            <EditableField
                label="LC Number"
                value={editedData.purchase?.lc_number || purchase.lc_number}
                section="purchase"
                field="lc_number"
                isEditing={editingSection !== null}
                currentValue={editedData.purchase?.lc_number || purchase.lc_number || ''}
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
    );

}


export default PurchaseDetailsSection;