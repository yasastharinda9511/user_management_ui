import React, { useState } from 'react';
import { Car, Calendar, Truck, Package, ChevronLeft, ChevronRight, Eye, MapPin, Plus, X, Ship, DollarSign } from 'lucide-react';
import CreateNewOrder from "./CreateNewOrder.jsx";

const OrderedCars = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const carsPerPage = 9;

    const handleOrderSubmit = (orderData) => {
        console.log('Order received:', orderData);
        // Handle the order data here - save to database, send API request, etc.
        alert(`Order ${orderData.isDraft ? 'saved as draft' : 'placed'} successfully!\nOrder Number: ${orderData.orderNumber}`);
    };

    // New Order Form State
    const [newOrderForm, setNewOrderForm] = useState({
        brand: '',
        model: '',
        year: '2024',
        color: '',
        variant: '',
        features: [],
        financing: 'cash'
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

    // Mock data based on your Excel structure
    const mockCarDeals = [
        {
            id: 1,
            code: 1,
            make: 'Toyota',
            model: 'Aqua',
            trimLevel: 'S',
            yom: 2012,
            color: 'Silver',
            mileage: 16600,
            chassisId: 'NHP10-6096289',
            condition: 'UNREGISTERED',
            auctionGrade: 'A/B',
            cif: 1500000,
            currency: 'JPY',
            vessel: 'Delphinus Leader v24',
            harbour: 'Nagoya',
            shipmentDate: '2013-12-26',
            arrivalDate: '2013-12-13',
            clearingDate: '2014-01-21',
            totalCostLKR: 3087694,
            soldDate: '2014-02-12',
            revenue: 3250000,
            profit: 162306,
            soldToName: 'Samanthika Perera',
            soldToTitle: 'Ms',
            contactNumber: '717331843/0412221319',
            address: 'Dondra',
            remarks: 'Cheque received from Siyapatha Finance'
        },
        {
            id: 2,
            code: 2,
            make: 'Toyota',
            model: 'Aqua',
            trimLevel: 'S',
            yom: 2012,
            color: 'White',
            mileage: 16000,
            chassisId: 'NHP10-6050119',
            condition: 'UNREGISTERED',
            auctionGrade: '5/A',
            cif: 0,
            currency: 'JPY',
            vessel: '',
            harbour: '',
            shipmentDate: '',
            arrivalDate: '2014-01-01',
            clearingDate: '2014-01-01',
            totalCostLKR: 2544900,
            soldDate: '',
            revenue: 2835100,
            profit: 290200,
            soldToName: '',
            soldToTitle: '',
            contactNumber: '',
            address: '',
            remarks: 'Bought by Mr Duminda for his customer'
        },
        {
            id: 3,
            code: 3,
            make: 'Honda',
            model: 'Fit',
            trimLevel: "She's",
            yom: 2013,
            color: 'Pearl White',
            mileage: 4704,
            chassisId: 'GP1-1206999',
            condition: 'UNREGISTERED',
            auctionGrade: '5/A',
            cif: 1590000,
            currency: 'JPY',
            vessel: 'Delphinus Leader v24',
            harbour: 'Nagoya',
            shipmentDate: '2013-12-26',
            arrivalDate: '2013-12-26',
            clearingDate: '2014-01-21',
            totalCostLKR: 3239261,
            soldDate: '2014-01-28',
            revenue: 3350000,
            profit: 110739,
            soldToName: 'Mohan (Com Bank)',
            soldToTitle: 'Mr',
            contactNumber: '',
            address: '',
            remarks: ''
        },
        {
            id: 4,
            code: 4,
            make: 'Toyota',
            model: 'Prius',
            trimLevel: 'S',
            yom: 2012,
            color: 'Pearl White',
            mileage: 8520,
            chassisId: 'ZVW30-5563533',
            condition: 'UNREGISTERED',
            auctionGrade: '5AA',
            cif: 2080000,
            currency: 'JPY',
            vessel: 'Noble Ace',
            harbour: 'Yokohama',
            shipmentDate: '2014-01-16',
            arrivalDate: '2014-01-29',
            clearingDate: '2014-02-06',
            totalCostLKR: 4470018,
            soldDate: '2014-02-10',
            revenue: 4625000,
            profit: 154982,
            soldToName: 'KA Susantha',
            soldToTitle: 'Mr',
            contactNumber: '716609525',
            address: 'Welegoda, Matara',
            remarks: ''
        },
        {
            id: 5,
            code: 5,
            make: 'Toyota',
            model: 'Aqua',
            trimLevel: 'G',
            yom: 2013,
            color: 'Pearl White',
            mileage: 2328,
            chassisId: 'NHP10-2176888',
            condition: 'UNREGISTERED',
            auctionGrade: '6AA',
            cif: 1910000,
            currency: 'JPY',
            vessel: 'Opal Ace v0020A',
            harbour: 'Kobe',
            shipmentDate: '2013-12-20',
            arrivalDate: '',
            clearingDate: '2014-01-21',
            totalCostLKR: 3759812,
            soldDate: '2014-01-21',
            revenue: 3850000,
            profit: 90188,
            soldToName: 'Nalaka',
            soldToTitle: 'Dr',
            contactNumber: '775093667',
            address: '',
            remarks: ''
        },
        {
            id: 6,
            code: 6,
            make: 'Mazda',
            model: 'Demio',
            trimLevel: '13S',
            yom: 2014,
            color: 'Red',
            mileage: 3500,
            chassisId: 'DJ5FS-800123',
            condition: 'UNREGISTERED',
            auctionGrade: '4.5/B',
            cif: 1450000,
            currency: 'JPY',
            vessel: 'Morning Crystal',
            harbour: 'Yokohama',
            shipmentDate: '2014-03-15',
            arrivalDate: '2014-03-30',
            clearingDate: '2014-04-10',
            totalCostLKR: 2850000,
            soldDate: '',
            revenue: 0,
            profit: 0,
            soldToName: '',
            soldToTitle: '',
            contactNumber: '',
            address: '',
            remarks: 'Still in stock'
        },
        {
            id: 7,
            code: 7,
            make: 'Honda',
            model: 'Vezel',
            trimLevel: 'Hybrid Z',
            yom: 2014,
            color: 'Blue',
            mileage: 8900,
            chassisId: 'RU3-1100456',
            condition: 'UNREGISTERED',
            auctionGrade: '5/A',
            cif: 2200000,
            currency: 'JPY',
            vessel: 'Asian Majesty',
            harbour: 'Nagoya',
            shipmentDate: '2014-04-20',
            arrivalDate: '2014-05-05',
            clearingDate: '',
            totalCostLKR: 4200000,
            soldDate: '',
            revenue: 0,
            profit: 0,
            soldToName: '',
            soldToTitle: '',
            contactNumber: '',
            address: '',
            remarks: 'Clearing in progress'
        },
        {
            id: 8,
            code: 8,
            make: 'Nissan',
            model: 'Note',
            trimLevel: 'X',
            yom: 2013,
            color: 'Black',
            mileage: 12000,
            chassisId: 'E12-567890',
            condition: 'UNREGISTERED',
            auctionGrade: '4/B',
            cif: 1350000,
            currency: 'JPY',
            vessel: 'Pacific Breeze',
            harbour: 'Kobe',
            shipmentDate: '2014-05-10',
            arrivalDate: '',
            clearingDate: '',
            totalCostLKR: 2650000,
            soldDate: '',
            revenue: 0,
            profit: 0,
            soldToName: '',
            soldToTitle: '',
            contactNumber: '',
            address: '',
            remarks: 'In transit'
        }
    ];

    // Create additional mock data
    const generateAdditionalMockData = () => {
        const additionalData = [];
        const makes = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Suzuki'];
        const models = {
            'Toyota': ['Aqua', 'Prius', 'Vitz', 'Axio', 'Fielder'],
            'Honda': ['Fit', 'Vezel', 'Grace', 'Freed', 'Shuttle'],
            'Nissan': ['Note', 'March', 'Tiida', 'X-Trail', 'Leaf'],
            'Mazda': ['Demio', 'Axela', 'Atenza', 'CX-3', 'CX-5'],
            'Suzuki': ['Swift', 'Wagon R', 'Alto', 'Spacia', 'Hustler']
        };
        const colors = ['Pearl White', 'Silver', 'Black', 'Blue', 'Red', 'Gray', 'White'];
        const grades = ['4/B', '4.5/B', '5/A', '5AA', '6AA', 'A/B'];
        const vessels = ['Delphinus Leader v24', 'Noble Ace', 'Opal Ace v0020A', 'Morning Crystal', 'Asian Majesty', 'Pacific Breeze'];
        const harbours = ['Nagoya', 'Yokohama', 'Kobe', 'Tokyo', 'Osaka'];

        for (let i = 9; i <= 50; i++) {
            const make = makes[Math.floor(Math.random() * makes.length)];
            const model = models[make][Math.floor(Math.random() * models[make].length)];
            const yom = 2012 + Math.floor(Math.random() * 8);
            const hasShipped = Math.random() > 0.3;
            const hasArrived = hasShipped && Math.random() > 0.4;
            const hasCleared = hasArrived && Math.random() > 0.5;
            const hasSold = hasCleared && Math.random() > 0.3;

            additionalData.push({
                id: i,
                code: i,
                make,
                model,
                trimLevel: ['S', 'G', 'X', 'Hybrid', 'Sport'][Math.floor(Math.random() * 5)],
                yom,
                color: colors[Math.floor(Math.random() * colors.length)],
                mileage: Math.floor(Math.random() * 50000) + 1000,
                chassisId: `${make.toUpperCase()}${Math.floor(Math.random() * 1000000)}`,
                condition: 'UNREGISTERED',
                auctionGrade: grades[Math.floor(Math.random() * grades.length)],
                cif: Math.floor(Math.random() * 2000000) + 1000000,
                currency: 'JPY',
                vessel: vessels[Math.floor(Math.random() * vessels.length)],
                harbour: harbours[Math.floor(Math.random() * harbours.length)],
                shipmentDate: hasShipped ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : '',
                arrivalDate: hasArrived ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : '',
                clearingDate: hasCleared ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : '',
                totalCostLKR: Math.floor(Math.random() * 3000000) + 2000000,
                soldDate: hasSold ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : '',
                revenue: hasSold ? Math.floor(Math.random() * 4000000) + 3000000 : 0,
                profit: hasSold ? Math.floor(Math.random() * 500000) + 100000 : 0,
                soldToName: hasSold ? ['John Silva', 'Mary Fernando', 'Kamal Perera', 'Saman Dias', 'Nimal Rajapaksa'][Math.floor(Math.random() * 5)] : '',
                soldToTitle: hasSold ? ['Mr', 'Ms', 'Dr'][Math.floor(Math.random() * 3)] : '',
                contactNumber: hasSold ? `07${Math.floor(Math.random() * 100000000)}` : '',
                address: hasSold ? ['Colombo', 'Kandy', 'Galle', 'Matara', 'Jaffna'][Math.floor(Math.random() * 5)] : '',
                remarks: ''
            });
        }
        return additionalData;
    };

    const allCarDeals = [...mockCarDeals, ...generateAdditionalMockData()];

    // Transform to component format
    const transformedCarData = allCarDeals.map(deal => {
        const getShippingStatus = () => {
            if (deal.soldDate) return 'Delivered';
            if (deal.clearingDate) return 'Cleared';
            if (deal.arrivalDate) return 'Arrived';
            if (deal.shipmentDate) return 'Shipped';
            return 'Processing';
        };

        const getCurrentLocation = () => {
            const status = getShippingStatus();
            switch (status) {
                case 'Delivered': return 'Customer Location';
                case 'Cleared': return 'Cleared - Sri Lanka';
                case 'Arrived': return deal.harbour || 'Port of Colombo';
                case 'Shipped': return 'In Transit';
                default: return deal.harbour || 'Japan';
            }
        };

        const getCarImage = (make) => {
            const carImages = {
                'Toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop',
                'Honda': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop',
                'Nissan': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
                'Mazda': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop',
                'Suzuki': 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=250&fit=crop'
            };
            return carImages[make] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=250&fit=crop';
        };

        return {
            id: deal.id,
            chassisNumber: deal.chassisId,
            model: `${deal.make} ${deal.model}`,
            brand: deal.make,
            year: deal.yom,
            color: deal.color,
            trimLevel: deal.trimLevel,
            mileage: deal.mileage,
            condition: deal.condition,
            auctionGrade: deal.auctionGrade,
            orderedDate: deal.shipmentDate || '2024-01-01',
            estimatedDelivery: deal.arrivalDate || '2024-12-31',
            shippingStatus: getShippingStatus(),
            price: `LKR ${deal.totalCostLKR.toLocaleString()}`,
            revenue: deal.revenue ? `LKR ${deal.revenue.toLocaleString()}` : 'N/A',
            profit: deal.profit ? `LKR ${deal.profit.toLocaleString()}` : 'N/A',
            image: getCarImage(deal.make),
            trackingNumber: `TRK${String(deal.code).padStart(9, '0')}`,
            currentLocation: getCurrentLocation(),
            orderNumber: `ORD-2024-${String(deal.code).padStart(3, '0')}`,
            vessel: deal.vessel,
            harbour: deal.harbour,
            soldTo: deal.soldToName,
            soldToTitle: deal.soldToTitle,
            contactNumber: deal.contactNumber,
            address: deal.address,
            soldDate: deal.soldDate,
            clearingDate: deal.clearingDate,
            remarks: deal.remarks,
            cif: deal.cif ? `JPY ${deal.cif.toLocaleString()}` : 'N/A'
        };
    });

    const totalPages = Math.ceil(transformedCarData.length / carsPerPage);
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = transformedCarData.slice(indexOfFirstCar, indexOfLastCar);

    const getStatusColor = (status) => {
        const statusColors = {
            'Delivered': 'bg-green-100 text-green-800 border-green-200',
            'Cleared': 'bg-blue-100 text-blue-800 border-blue-200',
            'Arrived': 'bg-purple-100 text-purple-800 border-purple-200',
            'Shipped': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Processing': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewDetails = (car) => {
        setSelectedCar(car);
    };

    const closeModal = () => {
        setSelectedCar(null);
    };

    const handleCreateOrder = () => {
        setShowCreateOrder(true);
    };

    const closeCreateOrder = () => {
        setShowCreateOrder(false);
        setNewOrderForm({
            brand: '',
            model: '',
            year: '2024',
            color: '',
            variant: '',
            features: [],
            financing: 'cash'
        });
    };

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

    const submitNewOrder = () => {
        console.log('New order submitted:', newOrderForm);
        alert('Order placed successfully!');
        closeCreateOrder();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Car Deals Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Track imported car orders from Japan - Shipping, clearing, and sales management
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Showing {indexOfFirstCar + 1}-{Math.min(indexOfLastCar, transformedCarData.length)} of {transformedCarData.length} deals
                    </div>
                    <button
                        onClick={handleCreateOrder}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Order</span>
                    </button>
                </div>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {currentCars.map((car) => (
                    <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Car Image */}
                        <div className="h-48 bg-gray-200 overflow-hidden">
                            <img
                                src={car.image}
                                alt={car.model}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/400x250/f3f4f6/6b7280?text=${car.brand}+${car.model.replace(' ', '+')}`;
                                }}
                            />
                        </div>

                        {/* Card Content */}
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{car.model}</h3>
                                    <p className="text-sm text-gray-600">{car.year} • {car.color} • {car.trimLevel}</p>
                                    <p className="text-xs text-gray-500">Grade: {car.auctionGrade} • {car.mileage.toLocaleString()} km</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(car.shippingStatus)}`}>
                                    {car.shippingStatus}
                                </span>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center text-sm">
                                    <Package className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Order:</span>
                                    <span className="font-medium text-gray-900">{car.orderNumber}</span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <Car className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Chassis:</span>
                                    <span className="font-mono text-xs text-gray-900">{car.chassisNumber}</span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <Ship className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Shipped:</span>
                                    <span className="text-gray-900">{formatDate(car.orderedDate)}</span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Location:</span>
                                    <span className="text-gray-900">{car.currentLocation}</span>
                                </div>

                                {car.vessel && (
                                    <div className="flex items-center text-sm">
                                        <Truck className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <span className="text-gray-600 min-w-[80px]">Vessel:</span>
                                        <span className="text-gray-900 text-xs">{car.vessel}</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="text-sm">
                                    <div className="text-lg font-bold text-blue-600">{car.price}</div>
                                    {car.profit !== 'N/A' && (
                                        <div className="text-xs text-green-600">Profit: {car.profit}</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleViewDetails(car)}
                                    className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Details</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center mt-8 space-x-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                        {(() => {
                            const pageNumbers = [];
                            const maxVisiblePages = 5;
                            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                            // Adjust start page if we're near the end
                            if (endPage - startPage + 1 < maxVisiblePages) {
                                startPage = Math.max(1, endPage - maxVisiblePages + 1);
                            }

                            // First page and ellipsis
                            if (startPage > 1) {
                                pageNumbers.push(
                                    <button
                                        key={1}
                                        onClick={() => handlePageChange(1)}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        1
                                    </button>
                                );
                                if (startPage > 2) {
                                    pageNumbers.push(
                                        <span key="start-ellipsis" className="px-2 text-gray-500">...</span>
                                    );
                                }
                            }

                            // Page number buttons
                            for (let i = startPage; i <= endPage; i++) {
                                pageNumbers.push(
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            currentPage === i
                                                ? 'bg-blue-600 text-white border border-blue-600'
                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {i}
                                    </button>
                                );
                            }

                            // Last page and ellipsis
                            if (endPage < totalPages) {
                                if (endPage < totalPages - 1) {
                                    pageNumbers.push(
                                        <span key="end-ellipsis" className="px-2 text-gray-500">...</span>
                                    );
                                }
                                pageNumbers.push(
                                    <button
                                        key={totalPages}
                                        onClick={() => handlePageChange(totalPages)}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        {totalPages}
                                    </button>
                                );
                            }

                            return pageNumbers;
                        })()}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            )}

            {/* Modal for detailed view */}
            {selectedCar && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Deal Details</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <img
                                        src={selectedCar.image}
                                        alt={selectedCar.model}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                        onError={(e) => {
                                            e.target.src = `https://via.placeholder.com/400x250/f3f4f6/6b7280?text=${selectedCar.brand}+${selectedCar.model.replace(' ', '+')}`;
                                        }}
                                    />

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Make & Model:</span>
                                                <span className="font-medium">{selectedCar.model}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Year:</span>
                                                <span className="font-medium">{selectedCar.year}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Color:</span>
                                                <span className="font-medium">{selectedCar.color}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Trim Level:</span>
                                                <span className="font-medium">{selectedCar.trimLevel}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Mileage:</span>
                                                <span className="font-medium">{selectedCar.mileage.toLocaleString()} km</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Condition:</span>
                                                <span className="font-medium">{selectedCar.condition}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Auction Grade:</span>
                                                <span className="font-medium">{selectedCar.auctionGrade}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedCar.model}</h3>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedCar.shippingStatus)}`}>
                                            {selectedCar.shippingStatus}
                                        </span>
                                    </div>

                                    {/* Order Details */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Order Number:</span>
                                                <span className="font-medium">{selectedCar.orderNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Chassis Number:</span>
                                                <span className="font-mono text-xs">{selectedCar.chassisNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tracking Number:</span>
                                                <span className="font-medium">{selectedCar.trackingNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Current Location:</span>
                                                <span className="font-medium">{selectedCar.currentLocation}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Details */}
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Shipping Details</h4>
                                        <div className="space-y-2 text-sm">
                                            {selectedCar.vessel && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Vessel:</span>
                                                    <span className="font-medium">{selectedCar.vessel}</span>
                                                </div>
                                            )}
                                            {selectedCar.harbour && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Departure Port:</span>
                                                    <span className="font-medium">{selectedCar.harbour}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Shipped Date:</span>
                                                <span className="font-medium">{formatDate(selectedCar.orderedDate)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Arrival Date:</span>
                                                <span className="font-medium">{formatDate(selectedCar.estimatedDelivery)}</span>
                                            </div>
                                            {selectedCar.clearingDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Clearing Date:</span>
                                                    <span className="font-medium">{formatDate(selectedCar.clearingDate)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Financial Details */}
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Financial Summary</h4>
                                        <div className="space-y-2 text-sm">
                                            {selectedCar.cif !== 'N/A' && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">CIF Value:</span>
                                                    <span className="font-medium">{selectedCar.cif}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Cost:</span>
                                                <span className="font-medium text-lg">{selectedCar.price}</span>
                                            </div>
                                            {selectedCar.revenue !== 'N/A' && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Revenue:</span>
                                                    <span className="font-medium">{selectedCar.revenue}</span>
                                                </div>
                                            )}
                                            {selectedCar.profit !== 'N/A' && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Profit:</span>
                                                    <span className="font-medium text-green-600">{selectedCar.profit}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Customer Details */}
                                    {selectedCar.soldTo && (
                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-3">Customer Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Customer:</span>
                                                    <span className="font-medium">{selectedCar.soldToTitle} {selectedCar.soldTo}</span>
                                                </div>
                                                {selectedCar.contactNumber && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Contact:</span>
                                                        <span className="font-medium">{selectedCar.contactNumber}</span>
                                                    </div>
                                                )}
                                                {selectedCar.address && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Address:</span>
                                                        <span className="font-medium">{selectedCar.address}</span>
                                                    </div>
                                                )}
                                                {selectedCar.soldDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Sold Date:</span>
                                                        <span className="font-medium">{formatDate(selectedCar.soldDate)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Remarks */}
                                    {selectedCar.remarks && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Remarks</h4>
                                            <p className="text-sm text-gray-700">{selectedCar.remarks}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create New Order Modal */}
            {showCreateOrder && (
                <CreateNewOrder
                    isOpen={showCreateOrder}
                    onClose={() => setShowCreateOrder(false)}
                    onSubmit={handleOrderSubmit}
                />
            )}
        </div>
    );
};

export default OrderedCars;