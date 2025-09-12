import React, { useState } from "react";
import {
    Car,
    DollarSign,
    Ship,
    Package,
    Calendar,
    Users,
    TrendingUp,
    AlertCircle,
    Clock,
    FileText,
    Camera,
    Wrench,
    CreditCard,
    BarChart3,
    Eye,
    Edit,
    Plus,
    Filter,
    PieChart as PieChartIcon,
    MapPin,
    Gauge,
    Truck
} from "lucide-react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";

const Dashboard = () => {
    const [selectedTab, setSelectedTab] = useState("overview");

    // Enhanced sample data with more details
    const dashboardData = {
        totalVehicles: 45,
        availableForSale: 23,
        soldVehicles: 18,
        inTransit: 8,
        totalInventoryValue: 125000000, // in LKR
        totalRevenue: 45000000,
        totalProfit: 12000000,
        pendingPayments: 3500000,
        monthlyStats: {
            purchased: 12,
            sold: 8,
            shipped: 15,
            profit: 2850000
        }
    };

    // Chart data using your corrected structure
    const vehicleStatusData = [
        { name: "Available", value: 23, color: "#10b981" },
        { name: "Sold", value: 18, color: "#3b82f6" },
        { name: "In Transit", value: 8, color: "#8b5cf6" },
        { name: "Reserved", value: 4, color: "#f59e0b" }
    ];

    const vehicleBrandData = [
        { name: "Toyota", value: 18, color: "#ef4444" },
        { name: "Honda", value: 12, color: "#3b82f6" },
        { name: "Nissan", value: 8, color: "#10b981" },
        { name: "Suzuki", value: 5, color: "#f59e0b" },
        { name: "Others", value: 2, color: "#8b5cf6" }
    ];

    const shippingStatusData = [
        { name: "Delivered", value: 25, color: "#10b981" },
        { name: "In Transit", value: 12, color: "#3b82f6" },
        { name: "Processing", value: 8, color: "#f59e0b" }
    ];

    const financialBreakdownData = [
        { name: "Vehicle Cost", value: 65, color: "#ef4444" },
        { name: "Duty & Taxes", value: 20, color: "#f59e0b" },
        { name: "Shipping", value: 10, color: "#3b82f6" },
        { name: "Other Expenses", value: 5, color: "#8b5cf6" }
    ];

    // Enhanced vehicle data with full details
    const featuredVehicles = [
        {
            vehicle: {
                id: 15,
                code: 15,
                make: "Toyota",
                model: "Fielder",
                trim_level: "X",
                year_of_manufacture: 2013,
                color: "Dark Blue",
                mileage_km: 22000,
                chassis_id: "NZE161G-3456789",
                condition_status: "UNREGISTERED",
                license_plate: null,
                auction_grade: "4.5/B",
                cif_value: 1400000,
                currency: "JPY"
            },
            vehicle_purchase: {
                bought_from_name: "Tokyo Auto Auction",
                purchase_date: "2014-08-20T00:00:00Z",
                lc_cost_jpy: 1350000,
                purchase_remarks: "Auction purchase - excellent condition"
            },
            vehicle_shipping: {
                vessel_name: "Blue Wave",
                departure_harbour: "Kobe",
                shipment_date: "2014-08-21T00:00:00Z",
                arrival_date: "2014-09-05T00:00:00Z",
                shipping_status: "DELIVERED"
            },
            vehicle_financials: {
                charges_lkr: 7000,
                duty_lkr: 1100000,
                clearing_lkr: 22000,
                other_expenses_lkr: 6000,
                total_cost_lkr: 3135000
            },
            vehicle_sales: {
                sale_status: "AVAILABLE",
                expected_price: 3800000
            },
            vehicle_image: {
                filename: "toyota-fielder-blue.jpg",
                is_primary: true
            }
        },
        {
            vehicle: {
                id: 16,
                make: "Honda",
                model: "Civic",
                year_of_manufacture: 2015,
                color: "Silver",
                mileage_km: 45000,
                condition_status: "REGISTERED",
                auction_grade: "4.0/A"
            },
            vehicle_sales: {
                sale_status: "SOLD",
                sold_date: "2024-09-01T00:00:00Z",
                revenue: 4200000,
                profit: 850000
            },
            vehicle_financials: {
                total_cost_lkr: 3350000
            }
        }
    ];

    const recentActivities = [
        {
            type: 'purchase',
            vehicle: 'Toyota Prius 2016',
            message: 'New vehicle purchased from auction',
            amount: 2850000,
            time: '2 hours ago',
            color: 'blue',
            icon: Car
        },
        {
            type: 'shipping',
            vehicle: 'Honda Civic 2015',
            message: 'Vehicle shipped via Ocean Express',
            time: '4 hours ago',
            color: 'purple',
            icon: Ship
        },
        {
            type: 'sale',
            vehicle: 'Nissan March 2014',
            message: 'Vehicle sold to customer',
            amount: 2850000,
            profit: 450000,
            time: '6 hours ago',
            color: 'green',
            icon: DollarSign
        },
        {
            type: 'registration',
            vehicle: 'Toyota Vitz 2013',
            message: 'Vehicle registration completed',
            time: '8 hours ago',
            color: 'orange',
            icon: FileText
        },
        {
            type: 'maintenance',
            vehicle: 'Honda Fit 2014',
            message: 'Pre-sale inspection completed',
            time: '1 day ago',
            color: 'red',
            icon: Wrench
        }
    ];

    const upcomingTasks = [
        {
            task: 'Vehicle Registration',
            vehicle: 'Toyota Fielder #15',
            dueDate: '2025-09-15',
            priority: 'high',
            type: 'registration'
        },
        {
            task: 'Duty Payment Due',
            vehicle: 'Honda Civic #16',
            dueDate: '2025-09-12',
            priority: 'urgent',
            type: 'payment'
        },
        {
            task: 'Vessel Arrival',
            vessel: 'Star Pioneer',
            dueDate: '2025-09-18',
            priority: 'medium',
            type: 'shipping'
        }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'AVAILABLE': 'bg-green-100 text-green-800',
            'SOLD': 'bg-blue-100 text-blue-800',
            'RESERVED': 'bg-yellow-100 text-yellow-800',
            'UNREGISTERED': 'bg-red-100 text-red-800',
            'REGISTERED': 'bg-green-100 text-green-800',
            'SHIPPED': 'bg-purple-100 text-purple-800',
            'DELIVERED': 'bg-blue-100 text-blue-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'urgent': 'bg-red-100 text-red-800 border-red-200',
            'high': 'bg-orange-100 text-orange-800 border-orange-200',
            'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'low': 'bg-green-100 text-green-800 border-green-200'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getActivityColors = (color) => {
        const map = {
            blue: "bg-blue-100 text-blue-600",
            purple: "bg-purple-100 text-purple-600",
            green: "bg-green-100 text-green-600",
            orange: "bg-orange-100 text-orange-600",
            red: "bg-red-100 text-red-600",
        };
        return map[color] || "bg-gray-100 text-gray-600";
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-gray-900">{payload[0].name}</p>
                    <p className="text-sm text-gray-600">Value: <span className="font-semibold">{payload[0].value}</span></p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Car Service Dashboard</h1>
                    <p className="text-gray-600 mt-2">Complete vehicle inventory and operations management</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Vehicle
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <Car className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardData.totalVehicles}</p>
                                <p className="text-xs text-green-600 mt-1">+{dashboardData.monthlyStats.purchased} this month</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalRevenue)}</p>
                                <p className="text-xs text-green-600 mt-1">+{dashboardData.monthlyStats.sold} sales this month</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalProfit)}</p>
                                <p className="text-xs text-purple-600 mt-1">{formatCurrency(dashboardData.monthlyStats.profit)} this month</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100">
                                <Ship className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">In Transit</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardData.inTransit}</p>
                                <p className="text-xs text-orange-600 mt-1">{dashboardData.monthlyStats.shipped} shipped this month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Available</p>
                            <p className="text-xl font-bold text-green-600">{dashboardData.availableForSale}</p>
                        </div>
                        <Package className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Sold</p>
                            <p className="text-xl font-bold text-blue-600">{dashboardData.soldVehicles}</p>
                        </div>
                        <Users className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Inventory Value</p>
                            <p className="text-lg font-bold text-purple-600">{formatCurrency(dashboardData.totalInventoryValue)}</p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Payments</p>
                            <p className="text-lg font-bold text-red-600">{formatCurrency(dashboardData.pendingPayments)}</p>
                        </div>
                        <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Analytics Dashboard with Pie Charts */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <PieChartIcon className="w-5 h-5 mr-2" />
                        Analytics Overview
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Vehicle Status Distribution */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Vehicle Status</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={vehicleStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {vehicleStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {vehicleStatusData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <span className="text-gray-600">{item.name}</span>
                                        </div>
                                        <span className="font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vehicle Brand Distribution */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Vehicle Brands</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={vehicleBrandData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {vehicleBrandData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {vehicleBrandData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <span className="text-gray-600">{item.name}</span>
                                        </div>
                                        <span className="font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Status */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Shipping Status</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={shippingStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {shippingStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {shippingStatusData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <span className="text-gray-600">{item.name}</span>
                                        </div>
                                        <span className="font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Cost Breakdown</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={financialBreakdownData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {financialBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {financialBreakdownData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <span className="text-gray-600">{item.name}</span>
                                        </div>
                                        <span className="font-medium">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Vehicles - Enhanced */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredVehicles.map((vehicle, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {vehicle.vehicle.make} {vehicle.vehicle.model}
                                    </h2>
                                    <p className="text-sm text-gray-600">Code: #{vehicle.vehicle.code || vehicle.vehicle.id}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(vehicle.vehicle_sales.sale_status)}`}>
                                        {vehicle.vehicle_sales.sale_status}
                                    </span>
                                    {vehicle.vehicle.condition_status && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(vehicle.vehicle.condition_status)}`}>
                                            {vehicle.vehicle.condition_status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <Car className="w-4 h-4 mr-2" />
                                        Vehicle Details
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Year:</span>
                                            <span className="font-medium">{vehicle.vehicle.year_of_manufacture}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Color:</span>
                                            <span className="font-medium">{vehicle.vehicle.color}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Mileage:</span>
                                            <span className="font-medium">{vehicle.vehicle.mileage_km?.toLocaleString()} km</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Grade:</span>
                                            <span className="font-medium">{vehicle.vehicle.auction_grade}</span>
                                        </div>
                                        {vehicle.vehicle.chassis_id && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Chassis:</span>
                                                <span className="font-medium text-xs">{vehicle.vehicle.chassis_id}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Financial Details
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Cost:</span>
                                            <span className="font-bold text-red-600">
                                                {formatCurrency(vehicle.vehicle_financials.total_cost_lkr)}
                                            </span>
                                        </div>
                                        {vehicle.vehicle_sales.expected_price && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Expected Price:</span>
                                                <span className="font-bold text-green-600">
                                                    {formatCurrency(vehicle.vehicle_sales.expected_price)}
                                                </span>
                                            </div>
                                        )}
                                        {vehicle.vehicle_sales.revenue && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Sale Price:</span>
                                                <span className="font-bold text-blue-600">
                                                    {formatCurrency(vehicle.vehicle_sales.revenue)}
                                                </span>
                                            </div>
                                        )}
                                        {vehicle.vehicle_sales.profit && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Profit:</span>
                                                <span className="font-bold text-green-600">
                                                    {formatCurrency(vehicle.vehicle_sales.profit)}
                                                </span>
                                            </div>
                                        )}
                                        {vehicle.vehicle_financials.duty_lkr && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Duty:</span>
                                                <span className="font-medium">
                                                    {formatCurrency(vehicle.vehicle_financials.duty_lkr)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {vehicle.vehicle_shipping && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 flex items-center mb-2">
                                        <Ship className="w-4 h-4 mr-2" />
                                        Shipping Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Vessel:</span>
                                            <span className="font-medium">{vehicle.vehicle_shipping.vessel_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(vehicle.vehicle_shipping.shipping_status)}`}>
                                                {vehicle.vehicle_shipping.shipping_status}
                                            </span>
                                        </div>
                                        {vehicle.vehicle_shipping.departure_harbour && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">From:</span>
                                                <span className="font-medium">{vehicle.vehicle_shipping.departure_harbour}</span>
                                            </div>
                                        )}
                                        {vehicle.vehicle_shipping.shipment_date && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Shipped:</span>
                                                <span className="font-medium">{formatDate(vehicle.vehicle_shipping.shipment_date)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </button>
                                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors flex items-center">
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </button>
                                {vehicle.vehicle_image && (
                                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors flex items-center">
                                        <Camera className="w-4 h-4 mr-1" />
                                        Photos
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Enhanced Recent Activity & Upcoming Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            Recent Activity
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => {
                                const IconComponent = activity.icon;
                                return (
                                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                                        <div className={`p-2 rounded-full ${getActivityColors(activity.color)} flex-shrink-0`}>
                                            <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{activity.vehicle}</p>
                                            <p className="text-sm text-gray-600">{activity.message}</p>
                                            {activity.amount && (
                                                <p className="text-sm font-semibold text-green-600">
                                                    {formatCurrency(activity.amount)}
                                                    {activity.profit && (
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            (Profit: {formatCurrency(activity.profit)})
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Upcoming Tasks
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {upcomingTasks.map((task, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(task.priority)}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{task.task}</p>
                                            <p className="text-sm text-gray-600">{task.vehicle || task.vessel}</p>
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                Due: {formatDate(task.dueDate)}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                            <Car className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Add Vehicle</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors group">
                            <Ship className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Track Shipment</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group">
                            <DollarSign className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Record Sale</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors group">
                            <FileText className="w-6 h-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Registration</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors group">
                            <Wrench className="w-6 h-6 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Maintenance</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors group">
                            <BarChart3 className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;