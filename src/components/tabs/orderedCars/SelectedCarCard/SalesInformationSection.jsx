import EditableField from "../EditableField.jsx";
import {formatDate, formatCurrency} from "../../../../utils/common.js";
import {fetchCustomerById, selectLoadingCustomer, selectSelectedCustomer, clearSelectedCustomer} from "../../../../state/customerSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";


const SalesInformationSection = ({editedData, editingSection, sales, updateField, onSelectChangeCustomer }) => {

    const dispatch = useDispatch();
    const loadingCustomer = useSelector(selectLoadingCustomer);
    const customer = useSelector(selectSelectedCustomer);

    // Fetch customer details when customer_id changes
    useEffect(() => {
        const customerId = editedData.sales?.customer_id;

        if (customerId && (!customer || customer.customer_id !== customerId)) {
            console.log("Fetching customer with ID:", customerId);
            dispatch(fetchCustomerById(customerId));
        } else if (!customerId) {
            // Clear customer state when no customer_id exists
            console.log("No customer_id, clearing customer state");
            dispatch(clearSelectedCustomer());
        }
    }, [editedData.sales?.customer_id, dispatch]);

    return (
        <div className="space-y-3">
            <EditableField
                label="Sale Status"
                value={editedData.sales?.sale_status || 'AVAILABLE'}
                section="sales"
                field="sale_status"
                options={['AVAILABLE', 'SOLD', 'RESERVED']}
                isEditing={editingSection !== null}
                currentValue={editedData.sales?.sale_status || 'AVAILABLE'}
                updateField={updateField}
            />
            <EditableField
                label="Sold Date"
                value={formatDate(editedData.sales?.sold_date)}
                section="sales"
                field="sold_date"
                type="date"
                isEditing={editingSection !== null}
                currentValue={editedData.sales?.sold_date ||''}
                updateField={updateField}
            />
            <EditableField
                label="Revenue (LKR)"
                value={formatCurrency(editedData.sales?.revenue)}
                section="sales"
                field="revenue"
                type="number"
                isEditing={editingSection !== null}
                currentValue={editedData.sales?.revenue || 0}
                updateField={updateField}
            />
            <EditableField
                label="Profit (LKR)"
                value={formatCurrency(editedData.sales?.profit)}
                section="sales"
                field="profit"
                type="number"
                isEditing={editingSection !== null}
                currentValue={editedData.sales?.profit || 0}
                updateField={updateField}
            />

            {/* Customer Information */}
            <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">Customer Information</span>
                    {(editedData.sales?.customer_id || sales.customer_id) && (
                        editingSection !== null && (
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

                {/* Display customer details (read-only) */}
                {loadingCustomer ? (
                    <p className="text-sm text-gray-500">Loading customer details...</p>
                ) : customer ? (
                    <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Name:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {customer.customer_title} {customer.customer_name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Email:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {customer.email || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Phone:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {customer.contact_number || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Type:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {customer.customer_type || 'N/A'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        {editingSection !== null ? 'Click "Assign Customer" to select a customer for this sale' : 'No customer assigned'}
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