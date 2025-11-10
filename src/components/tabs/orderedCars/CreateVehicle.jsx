import React, { useState } from 'react';
import { Car, Upload, X, Save, Plus, Trash2 } from 'lucide-react';

import {
    createVehicleRecordWithImage,
} from "../../../state/vehicleSlice.js";
import {useDispatch} from "react-redux";
import Notification from "../../common/Notification.jsx"

const CreateVehicle = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    // Vehicle Form State - matching your API structure
    const [vehicleForm, setVehicleForm] = useState({
        code: '',
        make: '',
        model: '',
        trim_level: '',
        year_of_manufacture: new Date().getFullYear(),
        color: '',
        mileage_km: '',
        chassis_id: '',
        condition_status: 'UNREGISTERED',
        auction_grade: '',
        cif_value: '',
        currency: 'LKR'
    });

    // Image upload state
    const [vehicleImages, setVehicleImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [notification, setNotification] = useState({
        type:"",
        title:"",
        message:"",

    })

    // Available options
    const availableCars = [
        { brand: 'Toyota', models: ['Aqua', 'Prius', 'Vitz', 'Axio', 'Fielder', 'Allion', 'Corolla', 'Camry'] },
        { brand: 'Honda', models: ['Fit', 'Vezel', 'Grace', 'Freed', 'Shuttle', 'CR-V', 'Civic', 'Accord'] },
        { brand: 'Nissan', models: ['Note', 'March', 'Tiida', 'X-Trail', 'Leaf', 'Sylphy', 'Altima'] },
        { brand: 'Mazda', models: ['Demio', 'Axela', 'Atenza', 'CX-3', 'CX-5', 'Premacy', 'MX-5'] },
        { brand: 'Suzuki', models: ['Swift', 'Wagon R', 'Alto', 'Spacia', 'Hustler', 'SX4', 'Vitara'] }
    ];

    const carColors = ['Pearl White', 'Silver', 'Black', 'Blue', 'Red', 'Gray', 'White', 'Dark Blue', 'Metallic Blue', 'Gun Metallic'];
    const auctionGrades = ['4/B', '4.5/B', '5/A', '5AA', '6AA', 'A/B', 'R/A'];
    const currencies = ['LKR', 'JPY', 'USD'];

    const handleFormChange = (field, value) => {
        setVehicleForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Image upload handlers
    const handleImageUpload = (files) => {
        const newImages = Array.from(files).map(file => ({
            id: Date.now() + Math.random(),
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));

        setVehicleImages(prev => [...prev, ...newImages]);
    };

    const handleFileSelect = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            handleImageUpload(files);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            handleImageUpload(files);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragActive(false);
    };

    const removeImage = (imageId) => {
        setVehicleImages(prev => {
            const imageToRemove = prev.find(img => img.id === imageId);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter(img => img.id !== imageId);
        });
    };

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
    };

    const hideNotification = () => {
        setNotification({ show: false, type: '', title: '', message: '' });
    };

    const resetForm = () => {
        setVehicleForm({
            code: '',
            make: '',
            model: '',
            trim_level: '',
            year_of_manufacture: new Date().getFullYear(),
            color: '',
            mileage_km: '',
            chassis_id: '',
            condition_status: 'UNREGISTERED',
            auction_grade: '',
            cif_value: '',
            currency: 'LKR'
        });

        // Clean up image previews
        vehicleImages.forEach(img => URL.revokeObjectURL(img.preview));
        setVehicleImages([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        // Prepare the vehicle data to match your API

        try{
            const vehicleData = {
                ...vehicleForm,
                code: parseInt(vehicleForm.code),
                year_of_manufacture: parseInt(vehicleForm.year_of_manufacture),
                mileage_km: vehicleForm.mileage_km ? parseInt(vehicleForm.mileage_km) : 0,
                cif_value: parseFloat(vehicleForm.cif_value) || 0
            };

            console.log('Vehicle data to submit:', vehicleData);
            console.log('Images to upload:', vehicleImages);

            await dispatch(createVehicleRecordWithImage(
                {vehicleData: vehicleData,
                    images: vehicleImages}
            )).unwrap();
            showNotification('success', 'Success', `Vehicle Created Successfully`);
        }catch (error) {
            showNotification('error', 'Fail', `Vehicle Created failed: ${error}`);
        }

    };

    const isFormValid = () => {
        return vehicleForm.code &&
            vehicleForm.make &&
            vehicleForm.model &&
            vehicleForm.chassis_id &&
            vehicleForm.color &&
            vehicleForm.cif_value;
    };

    if (!isOpen) return null;

    return (
        <>
            <Notification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                isVisible={notification.show}
                onClose={hideNotification}
            />
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Code *</label>
                                        <input
                                            type="number"
                                            value={vehicleForm.code}
                                            onChange={(e) => handleFormChange('code', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., 20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                                        <select
                                            value={vehicleForm.make}
                                            onChange={(e) => {
                                                handleFormChange('make', e.target.value);
                                                handleFormChange('model', '');
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Make</option>
                                            {availableCars.map((car) => (
                                                <option key={car.brand} value={car.brand}>{car.brand}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                                        <select
                                            value={vehicleForm.model}
                                            onChange={(e) => handleFormChange('model', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={!vehicleForm.make}
                                        >
                                            <option value="">Select Model</option>
                                            {vehicleForm.make &&
                                                availableCars
                                                    .find(car => car.brand === vehicleForm.make)
                                                    ?.models.map((model) => (
                                                    <option key={model} value={model}>{model}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Trim Level</label>
                                        <input
                                            type="text"
                                            value={vehicleForm.trim_level}
                                            onChange={(e) => handleFormChange('trim_level', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., XLE, S, G, Hybrid"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Year of Manufacture *</label>
                                        <select
                                            value={vehicleForm.year_of_manufacture}
                                            onChange={(e) => handleFormChange('year_of_manufacture', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                                        <select
                                            value={vehicleForm.color}
                                            onChange={(e) => handleFormChange('color', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Color</option>
                                            {carColors.map((color) => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km)</label>
                                        <input
                                            type="number"
                                            value={vehicleForm.mileage_km}
                                            onChange={(e) => handleFormChange('mileage_km', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., 5000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Chassis ID *</label>
                                        <input
                                            type="text"
                                            value={vehicleForm.chassis_id}
                                            onChange={(e) => handleFormChange('chassis_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., JTDEPRAE5NJ123458"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Condition Status</label>
                                        <select
                                            value={vehicleForm.condition_status}
                                            onChange={(e) => handleFormChange('condition_status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="UNREGISTERED">Unregistered</option>
                                            <option value="REGISTERED">Registered</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Auction Grade</label>
                                        <select
                                            value={vehicleForm.auction_grade}
                                            onChange={(e) => handleFormChange('auction_grade', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Grade</option>
                                            {auctionGrades.map((grade) => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CIF Value *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={vehicleForm.cif_value}
                                            onChange={(e) => handleFormChange('cif_value', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., 2500000.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                        <select
                                            value={vehicleForm.currency}
                                            onChange={(e) => handleFormChange('currency', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {currencies.map((currency) => (
                                                <option key={currency} value={currency}>{currency}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="bg-green-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Upload className="w-5 h-5 mr-2 text-green-600" />
                                    Vehicle Images
                                </h3>

                                {/* Upload Area */}
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        dragActive
                                            ? 'border-blue-400 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg text-gray-600 mb-2">
                                        Drag and drop images here, or
                                        <label className="text-blue-600 hover:text-blue-700 cursor-pointer ml-1">
                                            browse
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                        </label>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Support for JPG, PNG, GIF up to 10MB each
                                    </p>
                                </div>

                                {/* Image Preview Grid */}
                                {vehicleImages.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            Uploaded Images ({vehicleImages.length})
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {vehicleImages.map((image) => (
                                                <div key={image.id} className="relative group">
                                                    <img
                                                        src={image.preview}
                                                        alt={image.name}
                                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(image.id)}
                                                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500 truncate">{image.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                    onClick={handleSubmit}
                                    disabled={!isFormValid()}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Create Vehicle</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default CreateVehicle;