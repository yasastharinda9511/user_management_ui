import EditableField from "../EditableField.jsx";
import {formatCurrency} from "../../../../utils/common.js";

const FinancialSummarySection = ({editedData, editingSection, financials, updateField} ) => {

    return(<div className="space-y-3">
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
    </div>);
}

export default FinancialSummarySection;