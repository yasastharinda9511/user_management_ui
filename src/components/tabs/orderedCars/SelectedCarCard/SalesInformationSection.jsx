import EditableField from "../EditableField.jsx";
import {formatDate, formatCurrency} from "../../../../utils/common.js";
import {fetchCustomerById} from "../../../../state/customerSlice.js";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {Eye} from "lucide-react";


const SalesInformationSection = ({editedData, editingSection, sales, updateField, showNotification, onSelectChangeCustomer }) => {

    const dispatch = useDispatch();
    const [showViewCustomerModal, setShowViewCustomerModal] = useState(false);

    const handleViewCustomer = async (customerId) => {
        if (!customerId) {
            showNotification('warning', 'No Customer', 'No customer assigned to this sale');
            return;
        }

        try {
            console.log('Fetching customer with ID:', customerId);
            await dispatch(fetchCustomerById(customerId)).unwrap();
            setShowViewCustomerModal(true);
        } catch (error) {
            console.error('Failed to load customer:', error);
            showNotification('error', 'Error', 'Failed to load customer details: ' + error);
        }
    };


    return (
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
                            (
                                <button
                                    onClick={() => handleViewCustomer(editedData.sales?.customer_id || sales.customer_id)}
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
    );

}

export default SalesInformationSection;