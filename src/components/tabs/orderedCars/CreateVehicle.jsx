import React, { useState, useEffect } from 'react';
import { Car, Upload, X, Save, Plus, Trash2, FileText, UserCircle } from 'lucide-react';

import {
    createVehicleRecordWithImage,
} from "../../../state/vehicleSlice.js";
import {useDispatch, useSelector} from "react-redux";
import Notification from "../../common/Notification.jsx";
import { vehicleService } from "../../../api/index.js";
import {getAllDocumentTypes} from "../../../utils/documetsUtil.jsx";
import SelectCustomerModal from "./SelectCustomerModal.jsx";
import {fetchCustomerById, selectSelectedCustomer, clearSelectedCustomer} from "../../../state/customerSlice.js";

const CreateVehicle = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const selectedCustomer = useSelector(selectSelectedCustomer);

    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
        }
    }, [isOpen]);

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

    // Document upload state
    const [vehicleDocuments, setVehicleDocuments] = useState([]);
    const [notification, setNotification] = useState({
        type:"",
        title:"",
        message:"",

    })

    // Customer selection state
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    const [availableCars, setAvailableCars] = useState([]);
    const [models, setModels] = useState([]);
    const [loadingMakes, setLoadingMakes] = useState(true);
    const [loadingModels, setLoadingModels] = useState(false);
    const [modelsCache, setModelsCache] = useState({}); // Cache for models by make_id
    const [showAddMake, setShowAddMake] = useState(false);
    const [newMakeName, setNewMakeName] = useState('');
    const [showAddModel, setShowAddModel] = useState(false);
    const [newModelData, setNewModelData] = useState({
        model_name: '',
        body_type: '',
        fuel_type: '',
        transmission_type: '',
        engine_size_cc: ''
    });

    const carColors = ['Pearl White', 'Silver', 'Black', 'Blue', 'Red', 'Gray', 'White', 'Dark Blue', 'Metallic Blue', 'Gun Metallic'];
    const auctionGrades = ['4/B', '4.5/B', '5/A', '5AA', '6AA', 'A/B', 'R/A'];
    const currencies = ['LKR', 'JPY', 'USD'];
    const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Wagon', 'Coupe', 'Van', 'Truck', 'Convertible'];
    const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'LPG'];
    const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];

    // Fetch customer details when customer ID is selected
    useEffect(() => {
        if (selectedCustomerId) {
            dispatch(fetchCustomerById(selectedCustomerId));
        } else {
            dispatch(clearSelectedCustomer());
        }
    }, [selectedCustomerId, dispatch]);

    useEffect(() => {
        const fetchMakes = async () => {
            try {
                setLoadingMakes(true);
                const response = await vehicleService.getMakes();
                const transformedMakes = response.data?.map(make => ({
                    makeId: make.id,
                    make: make.make_name,
                }));
                setAvailableCars(transformedMakes);
            } catch (error) {
                console.error('Error fetching makes:', error);
                showNotification('error', 'Error', 'Failed to load vehicle makes');
                setAvailableCars([]);
            } finally {
                setLoadingMakes(false);
            }
        };
        if (isOpen) {
            fetchMakes();
        }
    }, [isOpen]);

    // Fetch models when make is selected
    useEffect(() => {
        const fetchModels = async () => {
            if (!vehicleForm.make) {
                setModels([]);
                return;
            }

            // Find the selected make to get its ID
            const selectedMake = availableCars.find(car => car.make === vehicleForm.make);
            if (!selectedMake) return;

            const makeId = selectedMake.makeId;

            // Check if models are already cached
            if (modelsCache[makeId]) {
                setModels(modelsCache[makeId]);
                return;
            }

            // Fetch models from API
            try {
                setLoadingModels(true);
                const response = await vehicleService.getModels(makeId);
                const fetchedModels = response.data || [];

                // Cache the models
                setModelsCache(prev => ({
                    ...prev,
                    [makeId]: fetchedModels
                }));

                setModels(fetchedModels);
            } catch (error) {
                console.error('Error fetching models:', error);
                showNotification('error', 'Error', 'Failed to load vehicle models');
                setModels([]);
            } finally {
                setLoadingModels(false);
            }
        };

        fetchModels();
    }, [vehicleForm.make, availableCars]);

    const handleFormChange = (field, value) => {
        setVehicleForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddMake = async () => {
        if (!newMakeName.trim()) {
            showNotification('error', 'Error', 'Please enter a make name');
            return;
        }

        try {
            const response = await vehicleService.createMake(newMakeName.trim());
            const createdMake = response.data;

            // Add the new make to the list
            setAvailableCars(prev => [...prev, {
                makeId: createdMake.id,
                make: createdMake.make_name
            }]);

            // Select the newly created make
            handleFormChange('make', createdMake.make_name);

            // Close the add make form
            setShowAddMake(false);
            setNewMakeName('');

            showNotification('success', 'Success', `Make "${createdMake.make_name}" added successfully`);
        } catch (error) {
            console.error('Error creating make:', error);
            showNotification('error', 'Error', 'Failed to create make: ' + error.message);
        }
    };

    const handleAddModel = async () => {
        if (!newModelData.model_name.trim()) {
            showNotification('error', 'Error', 'Please enter a model name');
            return;
        }

        if (!vehicleForm.make) {
            showNotification('error', 'Error', 'Please select a make first');
            return;
        }

        try {
            const selectedMake = availableCars.find(car => car.make === vehicleForm.make);
            if (!selectedMake) return;

            const modelData = {
                make_id: selectedMake.makeId,
                model_name: newModelData.model_name.trim(),
                body_type: newModelData.body_type || null,
                fuel_type: newModelData.fuel_type || null,
                transmission_type: newModelData.transmission_type || null,
                engine_size_cc: newModelData.engine_size_cc ? parseInt(newModelData.engine_size_cc) : null
            };

            const response = await vehicleService.createModel(modelData);
            const createdModel = response.data;

            // Add the new model to the list and cache
            const makeId = selectedMake.makeId;
            const updatedModels = [...models, createdModel];
            setModels(updatedModels);

            // Update cache
            setModelsCache(prev => ({
                ...prev,
                [makeId]: updatedModels
            }));

            // Select the newly created model
            handleFormChange('model', createdModel.model_name);

            // Close the add model form
            setShowAddModel(false);
            setNewModelData({
                model_name: '',
                body_type: '',
                fuel_type: '',
                transmission_type: '',
                engine_size_cc: ''
            });

            showNotification('success', 'Success', `Model "${createdModel.model_name}" added successfully`);
        } catch (error) {
            console.error('Error creating model:', error);
            showNotification('error', 'Error', 'Failed to create model: ' + error.message);
        }
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
            const imageToRemove = prev.find(img => img.id !== imageId);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter(img => img.id !== imageId);
        });
    };

    // Document handling functions
    const handleDocumentUpload = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newDocuments = Array.from(files).map((file, index) => ({
                id: Date.now() + index,
                file: file,
                documentType: 'LC_DOCUMENT', // Default type
                name: file.name,
                size: file.size
            }));
            setVehicleDocuments(prev => [...prev, ...newDocuments]);
        }
    };

    const removeDocument = (docId) => {
        setVehicleDocuments(prev => prev.filter(doc => doc.id !== docId));
    };

    const updateDocumentType = (docId, newType) => {
        setVehicleDocuments(prev =>
            prev.map(doc => doc.id === docId ? { ...doc, documentType: newType } : doc)
        );
    };

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
    };

    const hideNotification = () => {
        setNotification({ show: false, type: '', title: '', message: '' });
    };

    const handleCustomerSelect = (customerId) => {
        setSelectedCustomerId(customerId);
        setShowCustomerModal(false);
    };

    const handleRemoveCustomer = () => {
        setSelectedCustomerId(null);
        dispatch(clearSelectedCustomer());
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

        // Clear documents
        setVehicleDocuments([]);

        // Clear customer selection
        setSelectedCustomerId(null);
        dispatch(clearSelectedCustomer());
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            resetForm();
            setShouldRender(false);
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleSubmit = async () => {
        // Prepare the vehicle data to match your API

        try{
            const vehicleData = {
                ...vehicleForm,
                code: vehicleForm.code, // Keep as text
                year_of_manufacture: parseInt(vehicleForm.year_of_manufacture),
                mileage_km: vehicleForm.mileage_km ? parseInt(vehicleForm.mileage_km) : 0,
                cif_value: parseFloat(vehicleForm.cif_value) || 0
            };

            console.log('Vehicle data to submit:', vehicleData);
            console.log('Images to upload:', vehicleImages);
            console.log('Documents to upload:', vehicleDocuments);

            const result = await dispatch(createVehicleRecordWithImage(
                {vehicleData: vehicleData,
                    images: vehicleImages}
            )).unwrap();

            // Get the created vehicle ID
            const createdVehicleId = result?.id || result?.data?.id || result?.vehicle?.id;

            // Upload documents if any
            if (vehicleDocuments.length > 0 && createdVehicleId) {
                console.log('Uploading documents for vehicle:', createdVehicleId);
                for (const doc of vehicleDocuments) {
                    try {
                        await vehicleService.uploadVehicleDocument(
                            createdVehicleId,
                            doc.file,
                            doc.documentType,
                            doc.name
                        );
                    } catch (docError) {
                        console.error('Failed to upload document:', doc.name, docError);
                        showNotification('warning', 'Warning', `Vehicle created but failed to upload ${doc.name}`);
                    }
                }
            }

            // Update sales information with customer if selected
            if (selectedCustomerId && createdVehicleId) {
                try {
                    console.log('Updating sales information with customer:', selectedCustomerId);
                    await vehicleService.updateVehicleSales(createdVehicleId, {
                        customer_id: selectedCustomerId,
                        sale_status: "RESERVED",
                    });
                    showNotification('success', 'Success', `Vehicle created successfully and assigned to customer`);
                } catch (salesError) {
                    console.error('Failed to update sales information:', salesError);
                    showNotification('warning', 'Warning', `Vehicle created but failed to assign customer`);
                }
            } else {
                showNotification('success', 'Success', `Vehicle Created Successfully${vehicleDocuments.length > 0 ? ' with documents' : ''}`);
            }
        }catch (error) {
            showNotification('error', 'Fail', `Vehicle Created failed: ${error}`);
        }

    };

    const isFormValid = () => {
        return vehicleForm.code &&
            vehicleForm.make &&
            vehicleForm.model &&
            vehicleForm.color;
    };

    if (!shouldRender) return null;

    return (
        <>
            <Notification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                isVisible={notification.show}
                onClose={hideNotification}
            />
            <div className={`modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${isClosing ? 'closing' : ''}`}>
                <div className={`modal-content bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto ${isClosing ? 'closing' : ''}`}>
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
                                            type="text"
                                            value={vehicleForm.code}
                                            onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., VEH001"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={vehicleForm.make}
                                                onChange={(e) => {
                                                    handleFormChange('make', e.target.value);
                                                    handleFormChange('model', '');
                                                }}
                                                disabled={loadingMakes}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <option value="">{loadingMakes ? 'Loading makes...' : 'Select Make'}</option>
                                                {availableCars.map((car) => (
                                                    <option key={car.makeId} value={car.make}>{car.make}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddMake(!showAddMake)}
                                                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center"
                                                title="Add New Make"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Inline Add Make Form */}
                                        {showAddMake && (
                                            <div className="mt-2 p-3 bg-white border border-blue-200 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">New Make Name</label>
                                                <input
                                                    type="text"
                                                    value={newMakeName}
                                                    onChange={(e) => setNewMakeName(e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddMake();
                                                        }
                                                    }}
                                                    placeholder="e.g., Tesla"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddMake}
                                                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                    >
                                                        Add
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowAddMake(false);
                                                            setNewMakeName('');
                                                        }}
                                                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={vehicleForm.model}
                                                onChange={(e) => handleFormChange('model', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                disabled={!vehicleForm.make || loadingModels}
                                            >
                                                <option value="">
                                                    {loadingModels ? 'Loading models...' : !vehicleForm.make ? 'Select Make First' : 'Select Model'}
                                                </option>
                                                {models.map((model) => (
                                                    <option key={model.id} value={model.model_name}>
                                                        {model.model_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddModel(!showAddModel)}
                                                disabled={!vehicleForm.make}
                                                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Add New Model"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Inline Add Model Form */}
                                        {showAddModel && (
                                            <div className="mt-2 p-3 bg-white border border-blue-200 rounded-lg space-y-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Model Name *</label>
                                                        <input
                                                            type="text"
                                                            value={newModelData.model_name}
                                                            onChange={(e) => setNewModelData(prev => ({...prev, model_name: e.target.value}))}
                                                            placeholder="e.g., Camry"
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Body Type</label>
                                                        <select
                                                            value={newModelData.body_type}
                                                            onChange={(e) => setNewModelData(prev => ({...prev, body_type: e.target.value}))}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="">Select</option>
                                                            {bodyTypes.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Type</label>
                                                        <select
                                                            value={newModelData.fuel_type}
                                                            onChange={(e) => setNewModelData(prev => ({...prev, fuel_type: e.target.value}))}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="">Select</option>
                                                            {fuelTypes.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Transmission</label>
                                                        <select
                                                            value={newModelData.transmission_type}
                                                            onChange={(e) => setNewModelData(prev => ({...prev, transmission_type: e.target.value}))}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="">Select</option>
                                                            {transmissionTypes.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Engine Size (CC)</label>
                                                        <input
                                                            type="number"
                                                            value={newModelData.engine_size_cc}
                                                            onChange={(e) => setNewModelData(prev => ({...prev, engine_size_cc: e.target.value}))}
                                                            placeholder="e.g., 2500"
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddModel}
                                                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                    >
                                                        Add Model
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowAddModel(false);
                                                            setNewModelData({
                                                                model_name: '',
                                                                body_type: '',
                                                                fuel_type: '',
                                                                transmission_type: '',
                                                                engine_size_cc: ''
                                                            });
                                                        }}
                                                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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
                                        <input
                                            type="text"
                                            value={vehicleForm.color}
                                            onChange={(e) => handleFormChange('color', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., Pearl White, Silver, Black"
                                        />
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Chassis ID (REF17)</label>
                                        <input
                                            type="text"
                                            value={vehicleForm.chassis_id}
                                            onChange={(e) => handleFormChange('chassis_id', e.target.value.toUpperCase())}
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
                                        <input
                                            type="text"
                                            value={vehicleForm.auction_grade}
                                            onChange={(e) => handleFormChange('auction_grade', e.target.value.toUpperCase())}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., 4/B, 4.5/B, 5/A, 5AA, 6AA"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CIF Value</label>
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

                            {/* Customer Selection Section */}
                            <div className="bg-purple-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <UserCircle className="w-5 h-5 mr-2 text-purple-600" />
                                    Customer Information (Optional)
                                </h3>

                                {selectedCustomer ? (
                                    <div className="space-y-3">
                                        <div className="bg-white p-4 rounded-lg border border-purple-200">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-sm font-semibold text-gray-900">Selected Customer</h4>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCustomerModal(true)}
                                                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                    >
                                                        Change Customer
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveCustomer}
                                                        className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Name:</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {selectedCustomer.customer_title} {selectedCustomer.customer_name}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Email:</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {selectedCustomer.email || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Phone:</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {selectedCustomer.contact_number || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Type:</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {selectedCustomer.customer_type || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 italic">
                                            This vehicle will be assigned to this customer upon creation
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <UserCircle className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-600 mb-4">
                                            No customer selected. You can assign a customer to this vehicle now or later.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowCustomerModal(true)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                        >
                                            Select Customer
                                        </button>
                                    </div>
                                )}
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

                            {/* Document Upload Section */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                    Vehicle Documents (LC, Invoices, etc.)
                                </h3>

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg text-gray-600 mb-2">
                                        <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                                            Click to upload documents
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                onChange={handleDocumentUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Support for PDF, DOC, DOCX, JPG, PNG up to 10MB each
                                    </p>
                                </div>

                                {/* Document List */}
                                {vehicleDocuments.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            Documents to Upload ({vehicleDocuments.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {vehicleDocuments.map((doc) => (
                                                <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                        <select
                                                            value={doc.documentType}
                                                            onChange={(e) => updateDocumentType(doc.id, e.target.value)}
                                                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            {getAllDocumentTypes().map(docType => (
                                                                <option key={docType} value={docType}>{docType}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDocument(doc.id)}
                                                        className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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

            {/* Customer Selection Modal */}
            {showCustomerModal && (
                <SelectCustomerModal
                    currentCustomerId={selectedCustomerId}
                    onSelect={handleCustomerSelect}
                    onClose={() => setShowCustomerModal(false)}
                />
            )}
        </>

    );
};

export default CreateVehicle;