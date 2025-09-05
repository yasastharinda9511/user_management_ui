import React, { useState } from 'react';
import { Car, Package, Ship, DollarSign, MapPin, X, Save, Send } from 'lucide-react';

const CreateNewOrder = ({ isOpen, onClose, onSubmit }) => {
    // New Order Form State
    const [newOrderForm, setNewOrderForm] = useState({
        // Vehicle Information
        brand: '',
        model: '',
        year: '2024',
        color: '',
        trimLevel: '',
        mileage: '',
        condition: 'UNREGISTERED',
        auctionGrade: '',
        features: [],

        // Order Information
        orderType: 'auction',
        expectedDelivery: '',
        priority: 'normal',

        // Shipping Information
        preferredPort: '',
        shippingMethod: 'vessel',
        insurance: true,

        // Financial Information
        budgetMin: '',
        budgetMax: '',
        financing: 'cash',
        downPayment: '',

        // Customer Information
        customerName: '',
        customerTitle: 'Mr',
        contactNumber: '',
        email: '',
        address: '',

        // Additional Information
        specialRequests: '',
        notes: ''
    });

    // Available cars data for new orders
    const availableCars = [
        { brand: 'Toyota', models: ['Aqua', 'Prius', 'Vitz', 'Axio', 'Fielder', 'Allion'] },
        { brand: 'Honda', models: ['Fit', 'Vezel', 'Grace', 'Freed', 'Shuttle', 'CR-V'] },
        { brand: 'Nissan', models: ['Note', 'March', 'Tiida', 'X-Trail', 'Leaf', 'Sylphy'] },
        { brand: 'Mazda', models: ['Demio', 'Axela', 'Atenza', 'CX-3', 'CX-5', 'Premacy'] },
        { brand: 'Suzuki', models: ['Swift', 'Wagon R', 'Alto', 'Spacia', 'Hustler', 'SX4'] }
    ];

    const carColors = ['Pearl White', 'Silver', 'Black', 'Blue', 'Red', 'Gray', 'White', 'Dark Blue'];
    const carFeatures = ['Navigation System', 'Reverse Camera', 'ETC', 'Alloy Wheels', 'Smart Key', 'Auto AC', 'Power Steering', 'ABS'];
    const auctionGrades = ['4/B', '4.5/B', '5/A', '5AA', '6AA', 'A/B', 'R/A'];
    const japanPorts = ['Nagoya', 'Yokohama', 'Kobe', 'Tokyo', 'Osaka', 'Sendai'];
    const customerTitles = ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof'];

    const handleOrderFormChange = (field, value) => {
        setNewOrderForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFeatureToggle = (feature) => {
        setNewOrderForm(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const resetForm = () => {
        setNewOrderForm({
            // Vehicle Information
            brand: '',
            model: '',
            year: '2024',
            color: '',
            trimLevel: '',
            mileage: '',
            condition: 'UNREGISTERED',
            auctionGrade: '',
            features: [],

            // Order Information
            orderType: 'auction',
            expectedDelivery: '',
            priority: 'normal',

            // Shipping Information
            preferredPort: '',
            shippingMethod: 'vessel',
            insurance: true,

            // Financial Information
            budgetMin: '',
            budgetMax: '',
            financing: 'cash',
            downPayment: '',

            // Customer Information
            customerName: '',
            customerTitle: 'Mr',
            contactNumber: '',
            email: '',
            address: '',

            // Additional Information
            specialRequests: '',
            notes: ''
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (isDraft = false) => {
        const orderData = {
            ...newOrderForm,
            isDraft,
            submittedAt: new Date().toISOString(),
            orderNumber: `ORD-${Date.now()}`
        };

        console.log('Order submitted:', orderData);

        if (onSubmit) {
            onSubmit(orderData);
        } else {
            alert(`Order ${isDraft ? 'saved as draft' : 'placed'} successfully!`);
        }

        handleClose();
    };

    const isFormValid = () => {
        return newOrderForm.brand &&
            newOrderForm.model &&
            newOrderForm.color &&
            newOrderForm.customerName &&
            newOrderForm.contactNumber;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create New Car Order</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Vehicle Information Section */}
                        <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Car className="w-5 h-5 mr-2 text-blue-600" />
                                Vehicle Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                                    <select
                                        value={newOrderForm.brand}
                                        onChange={(e) => {
                                            handleOrderFormChange('brand', e.target.value);
                                            handleOrderFormChange('model', '');
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Brand</option>
                                        {availableCars.map((car) => (
                                            <option key={car.brand} value={car.brand}>{car.brand}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                                    <select
                                        value={newOrderForm.model}
                                        onChange={(e) => handleOrderFormChange('model', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={!newOrderForm.brand}
                                    >
                                        <option value="">Select Model</option>
                                        {newOrderForm.brand &&
                                            availableCars
                                                .find(car => car.brand === newOrderForm.brand)
                                                ?.models.map((model) => (
                                                <option key={model} value={model}>{model}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                                    <select
                                        value={newOrderForm.year}
                                        onChange={(e) => handleOrderFormChange('year', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                        <option value="2020">2020</option>
                                        <option value="2019">2019</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                                    <select
                                        value={newOrderForm.color}
                                        onChange={(e) => handleOrderFormChange('color', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Color</option>
                                        {carColors.map((color) => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Trim Level</label>
                                    <input
                                        type="text"
                                        value={newOrderForm.trimLevel}
                                        onChange={(e) => handleOrderFormChange('trimLevel', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., S, G, X, Hybrid"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Mileage (km)</label>
                                    <input
                                        type="number"
                                        value={newOrderForm.mileage}
                                        onChange={(e) => handleOrderFormChange('mileage', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., 50000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                                    <select
                                        value={newOrderForm.condition}
                                        onChange={(e) => handleOrderFormChange('condition', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="UNREGISTERED">Unregistered</option>
                                        <option value="REGISTERED">Registered</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Auction Grade</label>
                                    <select
                                        value={newOrderForm.auctionGrade}
                                        onChange={(e) => handleOrderFormChange('auctionGrade', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Any Grade</option>
                                        {auctionGrades.map((grade) => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Required Features</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {carFeatures.map((feature) => (
                                        <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newOrderForm.features.includes(feature)}
                                                onChange={() => handleFeatureToggle(feature)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Information Section */}
                        <div className="bg-purple-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-purple-600" />
                                Order Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                                    <select
                                        value={newOrderForm.orderType}
                                        onChange={(e) => handleOrderFormChange('orderType', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="auction">Auction Purchase</option>
                                        <option value="direct">Direct Purchase</option>
                                        <option value="dealer">Dealer Network</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery</label>
                                    <input
                                        type="date"
                                        value={newOrderForm.expectedDelivery}
                                        onChange={(e) => handleOrderFormChange('expectedDelivery', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={newOrderForm.priority}
                                        onChange={(e) => handleOrderFormChange('priority', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="high">High Priority</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information Section */}
                        <div className="bg-yellow-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Ship className="w-5 h-5 mr-2 text-yellow-600" />
                                Shipping Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Japan Port</label>
                                    <select
                                        value={newOrderForm.preferredPort}
                                        onChange={(e) => handleOrderFormChange('preferredPort', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">No Preference</option>
                                        {japanPorts.map((port) => (
                                            <option key={port} value={port}>{port}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                                    <select
                                        value={newOrderForm.shippingMethod}
                                        onChange={(e) => handleOrderFormChange('shippingMethod', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="vessel">Vessel (Standard)</option>
                                        <option value="container">Container (Premium)</option>
                                        <option value="roro">RoRo (Roll-on/Roll-off)</option>
                                    </select>
                                </div>

                                <div className="flex items-center pt-8">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newOrderForm.insurance}
                                            onChange={(e) => handleOrderFormChange('insurance', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Include Shipping Insurance</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Financial Information Section */}
                        <div className="bg-green-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                                Financial Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (LKR)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            value={newOrderForm.budgetMin}
                                            onChange={(e) => handleOrderFormChange('budgetMin', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Min Amount"
                                        />
                                        <input
                                            type="number"
                                            value={newOrderForm.budgetMax}
                                            onChange={(e) => handleOrderFormChange('budgetMax', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Max Amount"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                    <select
                                        value={newOrderForm.financing}
                                        onChange={(e) => handleOrderFormChange('financing', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="cash">Full Cash Payment</option>
                                        <option value="financing">Bank Financing</option>
                                        <option value="lease">Lease Agreement</option>
                                        <option value="installment">Installment Plan</option>
                                    </select>
                                </div>

                                {newOrderForm.financing !== 'cash' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment (LKR)</label>
                                        <input
                                            type="number"
                                            value={newOrderForm.downPayment}
                                            onChange={(e) => handleOrderFormChange('downPayment', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter down payment amount"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Information Section */}
                        <div className="bg-indigo-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                                Customer Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <select
                                        value={newOrderForm.customerTitle}
                                        onChange={(e) => handleOrderFormChange('customerTitle', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {customerTitles.map((title) => (
                                            <option key={title} value={title}>{title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                                    <input
                                        type="text"
                                        value={newOrderForm.customerName}
                                        onChange={(e) => handleOrderFormChange('customerName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter customer name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                                    <input
                                        type="tel"
                                        value={newOrderForm.contactNumber}
                                        onChange={(e) => handleOrderFormChange('contactNumber', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="07XXXXXXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={newOrderForm.email}
                                        onChange={(e) => handleOrderFormChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="customer@email.com"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <textarea
                                        value={newOrderForm.address}
                                        onChange={(e) => handleOrderFormChange('address', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="2"
                                        placeholder="Customer address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Section */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                                    <textarea
                                        value={newOrderForm.specialRequests}
                                        onChange={(e) => handleOrderFormChange('specialRequests', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="2"
                                        placeholder="Any specific requirements or modifications"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
                                    <textarea
                                        value={newOrderForm.notes}
                                        onChange={(e) => handleOrderFormChange('notes', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="2"
                                        placeholder="Internal notes for processing team"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit(true)}
                                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center space-x-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save as Draft</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit(false)}
                                disabled={!isFormValid()}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>Place Order</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewOrder;