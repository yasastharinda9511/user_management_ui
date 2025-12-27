import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Building2 } from 'lucide-react';
import { createSupplier, updateSupplier } from '../../../state/supplierSlice';

const SUPPLIER_TYPES = ['AUCTION', 'DEALER', 'PRIVATE', 'OTHER'];

const COUNTRIES = [
    'Japan', 'United States', 'United Kingdom', 'Germany', 'France',
    'Italy', 'Spain', 'Canada', 'Australia', 'South Korea', 'UAE', 'Other'
];

const CreateSupplier = ({ supplier = null, onClose, onSaved }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        supplier_name: '',
        supplier_type: 'AUCTION',
        contact_number: '',
        email: '',
        address: '',
        country: 'Japan',
        supplier_title: '',
        other_contacts: '',
        is_active: true
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                supplier_name: supplier.supplier_name || '',
                supplier_type: supplier.supplier_type || 'AUCTION',
                contact_number: supplier.contact_number || '',
                email: supplier.email || '',
                address: supplier.address || '',
                country: supplier.country || 'Japan',
                supplier_title: supplier.supplier_title || '',
                other_contacts: supplier.other_contacts || '',
                is_active: supplier.is_active !== undefined ? supplier.is_active : true
            });
        }
    }, [supplier]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Remove empty optional fields
            const submitData = { ...formData };
            if (!submitData.supplier_title) delete submitData.supplier_title;
            if (!submitData.other_contacts) delete submitData.other_contacts;

            if (supplier) {
                await dispatch(updateSupplier({ supplierId: supplier.id, supplierData: submitData })).unwrap();
            } else {
                await dispatch(createSupplier(submitData)).unwrap();
            }
            onSaved();
        } catch (err) {
            setError(err || 'Failed to save supplier');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${isClosing ? 'closing' : ''}`}>
            <div className={`modal-content bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${isClosing ? 'closing' : ''}`}>
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {supplier ? 'Edit Supplier' : 'Add New Supplier'}
                                </h2>
                                <p className="text-blue-100 text-sm mt-1">
                                    {supplier ? 'Update supplier information' : 'Fill in the details below'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Supplier Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Supplier Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="supplier_name"
                                value={formData.supplier_name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., USS Auction Tokyo"
                            />
                        </div>

                        {/* Supplier Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Supplier Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="supplier_type"
                                value={formData.supplier_type}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {SUPPLIER_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Two columns for contact info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="email@example.com"
                                />
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="+81-3-1234-5678"
                                />
                            </div>
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {COUNTRIES.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full address"
                            />
                        </div>

                        {/* Optional Fields */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Optional Information</h3>

                            <div className="space-y-4">
                                {/* Supplier Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title/Position
                                    </label>
                                    <input
                                        type="text"
                                        name="supplier_title"
                                        value={formData.supplier_title}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Sales Manager"
                                    />
                                </div>

                                {/* Other Contacts */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Other Contacts
                                    </label>
                                    <textarea
                                        name="other_contacts"
                                        value={formData.other_contacts}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Additional contact information"
                                    />
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                        Active supplier
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            style={{
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {loading ? 'Saving...' : (supplier ? 'Update Supplier' : 'Create Supplier')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSupplier;
