import React, { useState } from 'react';
import {
    User,
    LogOut,
    Search,
    Bell,
    Home,
    Users,
    BarChart3,
    Settings,
    FileText,
    Calendar
} from 'lucide-react';
import Profile from "./tabs/Profile.jsx";
import OrderedCars from "./tabs/OrderedCars.jsx";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'JD'
    };

    const tabs = [
        { id: 'ordered cars', label: 'Ordered cars', icon: User },
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },

    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening.</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">1,234</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100">
                                        <BarChart3 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">$12,345</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <Bell className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Notifications</p>
                                        <p className="text-2xl font-bold text-gray-900">23</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-orange-100">
                                        <Settings className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                                        <p className="text-2xl font-bold text-gray-900">8</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <p className="text-sm text-gray-600">New user registered - Sarah Johnson</p>
                                        <span className="text-xs text-gray-400">2 hours ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="text-sm text-gray-600">Payment processed - $299.99</p>
                                        <span className="text-xs text-gray-400">4 hours ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <p className="text-sm text-gray-600">System update completed</p>
                                        <span className="text-xs text-gray-400">6 hours ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <Profile></Profile>
                );
            case 'ordered cars':
                return (
                    <OrderedCars></OrderedCars>
                );

            case 'analytics':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                            <p className="text-gray-600 mt-2">View your performance metrics.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">Chart placeholder</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">Chart placeholder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                            <p className="text-gray-600 mt-2">Configure your preferences.</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Email Notifications</p>
                                        <p className="text-sm text-gray-600">Receive email updates and notifications</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Dark Mode</p>
                                        <p className="text-sm text-gray-600">Toggle dark mode theme</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-100">
            {/* Sidebar - Always visible and static */}
            <div className="w-64 fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-10">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Dashboard</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User info and logout */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{user.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign out</span>
                    </button>
                </div>
            </div>

            {/* Main content area - starts right after sidebar */}
            <div className="ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 h-16 flex-shrink-0">
                    <div className="flex items-center justify-between h-full">
                        {/* Search bar - centered in available space */}
                        <div className="flex-1 flex justify-center">
                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                />
                            </div>
                        </div>

                        {/* Right side icons */}
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">{user.avatar}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content - starts immediately after header */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;