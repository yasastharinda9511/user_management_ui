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
    Calendar,
    ChevronLeft,
    ChevronRight,
    Menu,
    Shield,
    Key
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectPermissions } from '../state/authSlice.js';
import { getAccessibleTabs } from '../utils/permissionUtils.js';

const MainScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const permissions = useSelector(selectPermissions);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'JD'
    };

    // Get tabs based on user permissions
    const tabs = getAccessibleTabs(permissions);

    return (
        <div className="h-screen w-screen bg-gray-100">
            {/* Sidebar - Collapsible */}
            <div className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-10 transition-all duration-300 ${
                sidebarCollapsed ? 'w-20' : 'w-64'
            }`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <span className="text-xl font-bold text-gray-900">Dashboard</span>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {sidebarCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
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
                                }}
                                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 text-left rounded-lg transition-colors ${
                                    location.pathname === tab.path
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                                title={sidebarCollapsed ? tab.label : ''}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!sidebarCollapsed && (
                                    <span className="font-medium">{tab.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User info and logout */}
                <div className="border-t border-gray-200 p-4">
                    {!sidebarCollapsed ? (
                        <>
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
                        </>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">{user.avatar}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content area - starts right after sidebar */}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${
                sidebarCollapsed ? 'ml-20' : 'ml-64'
            }`}>
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