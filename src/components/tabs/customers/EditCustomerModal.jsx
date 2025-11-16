import React, { useState } from 'react';
import { X, Save, User, Mail, Phone, MapPin, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, selectUpdating } from '../../../state/customerSlice.js';
import Notification from '../../common/Notification.jsx';

const EditCustomerModal = ({ customer, onClose }) => {
    const dispatch = useDispatch();
    const updating = useSelector(selectUpdating);

    const [formData, setFormData] = useState({
        customer_title: customer.customer_title || '',
        customer_name: customer.customer_name || '',
        contact_number: customer.contact_number || '',
        email: customer.email || '',
        address: customer.address || '',
        other_contacts: customer.other_contacts || '',
        customer_type: customer.customer_type || '',
        is_active: customer.is_active !== undefined ? customer.is_active : true
    });

    const [notification, setNotification] = useState({
        isVisible: false,
        type: 'success',
        title: '',
        message: ''
    });

    const showNotification = (type, title, message) => {
        setNotification({
            isVisible: true,
            type,
            title,
            message
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleToggleActive = () => {
        setFormData(prev => ({
            ...prev,
            is_active: !prev.is_active
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.customer_name.trim()) {
            showNotification('error', 'Validation Error', 'Customer name is required');
            return;
        }

        const customerData = {
            customer_title: formData.customer_title.trim() || undefined,
            customer_name: formData.customer_name.trim(),
            contact_number: formData.contact_number.trim() || undefined,
            email: formData.email.trim() || undefined,
            address: formData.address.trim() || undefined,
            other_contacts: formData.other_contacts.trim() || undefined,
            customer_type: formData.customer_type.trim() || undefined,
            is_active: formData.is_active
        };

        try {
            const customerId = customer.id || customer.customer_id;
            await dispatch(updateCustomer({ customerId, customerData })).unwrap();
            showNotification('success', 'Success', 'Customer updated successfully');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            showNotification('error', 'Error', error || 'Failed to update customer');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Notification
                isVisible={notification.isVisible}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification({ ...notification, isVisible: false })}
            />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal panel */}
                <div className="relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-2xl">
                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Edit Customer
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Update customer details and information
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="space-y-6">
                            {/* Customer ID (read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer ID
                                </label>
                                <input
                                    type="text"
                                    value={customer.id || customer.customer_id || 'N/A'}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>

                            {/* Title and Name */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <select
                                        name="customer_title"
                                        value={formData.customer_title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Ms">Ms</option>
                                        <option value="Dr">Dr</option>
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Customer Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter customer name"
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4" />
                                            <span>Contact Number</span>
                                        </div>
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact_number"
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="1234567890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4" />
                                            <span>Email</span>
                                        </div>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="customer@example.com"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>Address</span>
                                    </div>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter customer address"
                                />
                            </div>

                            {/* Other Contacts */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Other Contacts
                                </label>
                                <input
                                    type="text"
                                    name="other_contacts"
                                    value={formData.other_contacts}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Additional contact information"
                                />
                            </div>

                            {/* Customer Type and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Tag className="w-4 h-4" />
                                            <span>Customer Type</span>
                                        </div>
                                    </label>
                                    <select
                                        name="customer_type"
                                        value={formData.customer_type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select type</option>
                                        <option value="INDIVIDUAL">Individual</option>
                                        <option value="BUSSINESS">Corporate</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleToggleActive}
                                        className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                                            formData.is_active
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        }`}
                                    >
                                        {formData.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                <span>{updating ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCustomerModal;
