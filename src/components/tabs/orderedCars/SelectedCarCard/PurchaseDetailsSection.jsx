import {useEffect} from "react";
import EditableField from "../EditableField.jsx";
import {formatCurrency, formatDate} from "../../../../utils/common.js";
import {
    clearSelectedSupplier,
    fetchSupplierById,
    selectLoadingSupplier,
    selectSelectedSupplier
} from "../../../../state/supplierSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {History} from "lucide-react";

const PurchaseDetailsSection = ({editedData, editingSection, purchase, updateField, onSelectChangeSupplier, onShowPurchaseHistory })=>{

    const dispatch = useDispatch();
    const loadingSupplier = useSelector(selectLoadingSupplier);
    const supplier = useSelector(selectSelectedSupplier);

    // Fetch supplier details when supplier_id changes
    useEffect(() => {
        const supplierId = editedData.purchase?.supplier_id;

        if (supplierId && (!supplier || supplier.supplier_id !== supplierId)) {
            dispatch(fetchSupplierById(supplierId));
        } else if (!supplierId) {
            dispatch(clearSelectedSupplier());
        }
    }, [editedData.purchase?.supplier_id, dispatch]);

    return (
        <div className="space-y-3">
            {/* Purchase History Button */}
            {onShowPurchaseHistory && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={onShowPurchaseHistory}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        type="button"
                    >
                        <History className="w-4 h-4 mr-2" />
                        View Purchase History
                    </button>
                </div>
            )}

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


            {/* Supplier Information */}
            <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">Supplier Information</span>
                    {(editedData.purchase?.supplier_id || purchase.supplier_id) && (
                        editingSection !== null && (
                            // Edit mode - show select/change button
                            onSelectChangeSupplier && (
                                <button
                                    onClick={onSelectChangeSupplier}
                                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    type="button"
                                >
                                    Select/Change Supplier
                                </button>
                            )
                        )
                    )}
                    {!(editedData.purchase?.supplier_id || purchase.supplier_id) && editingSection !== null && onSelectChangeSupplier && (
                        <button
                            onClick={onSelectChangeSupplier}
                            className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            type="button"
                        >
                            Assign Supplier
                        </button>
                    )}
                </div>

                {/* Display supplier details (read-only) */}
                {loadingSupplier ? (
                    <p className="text-sm text-gray-500">Loading supplier details...</p>
                ) : (
                    <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Name:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {supplier?.supplier_name || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Email:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {supplier?.email || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Phone:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {supplier?.contact_number || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Country:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {supplier?.country || 'N/A'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}


export default PurchaseDetailsSection;