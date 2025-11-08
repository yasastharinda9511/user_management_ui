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
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../state/authSlice.js';

const MainScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'JD'
    };

    const tabs = [
        { path: '/ordered-cars', label: 'Ordered cars', icon: User },
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/settings', label: 'Settings', icon: Settings },

    ];

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
                                key={tab.path}
                                onClick={() => {
                                    navigate(tab.path);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                    location.pathname === tab.path
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
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                    >
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
                    {/* Outlet renders the child route components */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainScreen;