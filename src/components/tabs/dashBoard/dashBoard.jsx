import React, {useEffect, useState, useMemo} from "react";
import {
    Car,
    DollarSign,
    Ship,
    Package,
    TrendingUp,
    TrendingDown,
    BarChart3,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";
import {useDispatch, useSelector} from "react-redux";

import {
    fetchShippingStatus,
    selectShippingStatus,
    selectFinancialSummary,
    fetchFinancialSummary,
    selectVehicleStatsSummary,
    fetchVehicleStats,
    selectVehicleSalesSummary,
    fetSalesStatusSummary
} from '../../../state/dashBoardSlice.js';

const Dashboard = () => {
    const dispatch = useDispatch();

    const shippingStatus = useSelector(selectShippingStatus);
    const financialSummary = useSelector(selectFinancialSummary);
    const vehicleStatsSummary = useSelector(selectVehicleStatsSummary);
    const vehicleSalesSummary = useSelector(selectVehicleSalesSummary);

    const [refreshing, setRefreshing] = useState(false);

    const [filters, setFilters] = useState({
        dateRangeStart: "",
        dateRangeEnd: "",
    })

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setRefreshing(true);
        await Promise.all([
            dispatch(fetchShippingStatus({ filters })),
            dispatch(fetchFinancialSummary({ filters })),
            dispatch(fetchVehicleStats({ filters })),
            dispatch(fetSalesStatusSummary({ filters }))
        ]);
        setRefreshing(false);
    };

    // Calculate insights from API data
    const insights = useMemo(() => {
        // Total vehicles from shipping status
        const totalVehicles = shippingStatus.data.reduce((sum, item) => sum + item.value, 0);

        // Sales summary
        const availableCount = vehicleSalesSummary.data.find(item => item.name.includes('Available'))?.value || 0;
        const soldCount = vehicleSalesSummary.data.find(item => item.name.includes('Sold'))?.value || 0;
        const reservedCount = vehicleSalesSummary.data.find(item => item.name.includes('Reserved'))?.value || 0;

        // Shipping breakdown
        const inTransitCount = shippingStatus.data.find(item => item.name === 'Shipped')?.value || 0;
        const deliveredCount = shippingStatus.data.find(item => item.name === 'Delivered')?.value || 0;
        const processingCount = shippingStatus.data.find(item => item.name === 'Processing')?.value || 0;
        const arrivedCount = shippingStatus.data.find(item => item.name === 'Arrived')?.value || 0;
        const clearedCount = shippingStatus.data.find(item => item.name === 'Cleared')?.value || 0;

        // Financial totals
        const totalCharges = financialSummary.data.find(item => item.name.includes('Charges'))?.value || 0;
        const totalDuty = financialSummary.data.find(item => item.name.includes('Duty'))?.value || 0;
        const totalClearing = financialSummary.data.find(item => item.name.includes('Clearing'))?.value || 0;
        const totalExpenses = totalCharges + totalDuty + totalClearing;

        // Calculate rates
        const soldRate = totalVehicles > 0 ? ((soldCount / totalVehicles) * 100).toFixed(1) : 0;
        const deliveryRate = totalVehicles > 0 ? ((deliveredCount / totalVehicles) * 100).toFixed(1) : 0;

        return {
            totalVehicles,
            availableCount,
            soldCount,
            reservedCount,
            inTransitCount,
            deliveredCount,
            processingCount,
            arrivedCount,
            clearedCount,
            totalExpenses,
            soldRate,
            deliveryRate
        };
    }, [shippingStatus.data, vehicleSalesSummary.data, financialSummary.data]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null;

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
                fontSize={14}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const isCurrency = payload[0].payload.name &&
                (payload[0].payload.name.includes('Duty') ||
                 payload[0].payload.name.includes('Charges') ||
                 payload[0].payload.name.includes('Clearing') ||
                 payload[0].payload.name.includes('Expenses'));

            return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-gray-900">{payload[0].name}</p>
                    <p className="text-sm text-gray-600">
                        {isCurrency ? formatCurrency(payload[0].value) : payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color.bg}`}>
                    <Icon className={`w-6 h-6 ${color.text}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
            </div>
        </div>
    );

    const isLoading = shippingStatus.loading || financialSummary.loading ||
                      vehicleStatsSummary.loading || vehicleSalesSummary.loading;

    if (isLoading && insights.totalVehicles === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Monitor your vehicle inventory and business metrics</p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Vehicles"
                    value={insights.totalVehicles}
                    icon={Car}
                    color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
                    subtitle={`${insights.availableCount} available for sale`}
                />
                <StatCard
                    title="Sold Vehicles"
                    value={insights.soldCount}
                    icon={DollarSign}
                    color={{ bg: 'bg-green-100', text: 'text-green-600' }}
                    trend="up"
                    trendValue={`${insights.soldRate}%`}
                    subtitle="Sales conversion rate"
                />
                <StatCard
                    title="In Transit"
                    value={insights.inTransitCount}
                    icon={Ship}
                    color={{ bg: 'bg-purple-100', text: 'text-purple-600' }}
                    subtitle={`${insights.deliveredCount} delivered`}
                />
                <StatCard
                    title="Total Expenses"
                    value={formatCurrency(insights.totalExpenses)}
                    icon={BarChart3}
                    color={{ bg: 'bg-orange-100', text: 'text-orange-600' }}
                    subtitle="Duties, charges & clearing"
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Available</p>
                    <p className="text-2xl font-bold text-green-600">{insights.availableCount}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Reserved</p>
                    <p className="text-2xl font-bold text-yellow-600">{insights.reservedCount}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Processing</p>
                    <p className="text-2xl font-bold text-orange-600">{insights.processingCount}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Arrived</p>
                    <p className="text-2xl font-bold text-purple-600">{insights.arrivedCount}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Cleared</p>
                    <p className="text-2xl font-bold text-blue-600">{insights.clearedCount}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Status Chart */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Sales Status Distribution</h3>
                        <p className="text-sm text-gray-600 mt-1">Current inventory status breakdown</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={vehicleSalesSummary.data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {vehicleSalesSummary.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {vehicleSalesSummary.data.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 truncate">{item.name}</p>
                                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Status Chart */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Shipping Status</h3>
                        <p className="text-sm text-gray-600 mt-1">Current shipping pipeline overview</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={shippingStatus.data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {shippingStatus.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {shippingStatus.data.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 truncate">{item.name}</p>
                                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vehicle Brands Chart */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Vehicle Brands</h3>
                        <p className="text-sm text-gray-600 mt-1">Inventory breakdown by manufacturer</p>
                    </div>
                    <div className="flex justify-center">
                        <ResponsiveContainer width="80%" height={250}>
                            <BarChart data={vehicleStatsSummary.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={30}>
                                    {vehicleStatsSummary.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Financial Breakdown Chart */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Financial Breakdown</h3>
                        <p className="text-sm text-gray-600 mt-1">Total expenses by category</p>
                    </div>
                    <div className="flex justify-center">
                        <ResponsiveContainer width="80%" height={250}>
                            <BarChart data={financialSummary.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={30}>
                                    {financialSummary.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-2">
                        {financialSummary.data.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-gray-700">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                            <p className="text-sm font-medium text-gray-600">Sales Performance</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{insights.soldRate}%</p>
                        <p className="text-xs text-gray-500 mt-1">{insights.soldCount} of {insights.totalVehicles} vehicles sold</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-5 h-5 text-blue-600" />
                            <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{insights.deliveryRate}%</p>
                        <p className="text-xs text-gray-500 mt-1">{insights.deliveredCount} vehicles successfully delivered</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Ship className="w-5 h-5 text-purple-600" />
                            <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{insights.inTransitCount}</p>
                        <p className="text-xs text-gray-500 mt-1">Currently in transit</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
