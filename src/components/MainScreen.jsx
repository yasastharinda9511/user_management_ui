import React, { useState, useEffect, useRef } from 'react';
import {
    User,
    LogOut,
    Search,
    Bell,
    ChevronLeft,
    ChevronRight,
    X as XIcon,
    Car,
    UserCircle,
    Building2,
    Loader2
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {logout, selectPermissions, selectUser} from '../state/authSlice.js';
import { getAccessibleTabs } from '../utils/permissionUtils.js';
import ConfirmationModal from './common/ConfirmationModal.jsx';
import vehicleService from '../api/vehicleService';
import customerService from '../api/customerService';
import supplierService from '../api/supplierService';
import ProfileDropdown from "./common/ProfileDropDown.jsx";
import { fetchNotifications, selectUnreadCount } from '../state/notificationSlice.js';

const MainScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const permissions = useSelector(selectPermissions);
    const user = useSelector(selectUser);
    const unreadNotifications = useSelector(selectUnreadCount);

    // Sidebar resize state
    const [sidebarWidth, setSidebarWidth] = useState(264); // Default 264px
    const [isResizing, setIsResizing] = useState(false);
    const [lastExpandedWidth, setLastExpandedWidth] = useState(264);
    const sidebarCollapsed = sidebarWidth <= 80; // Derived state

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Global search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ vehicles: [], customers: [], suppliers: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const profileRef = useRef(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    useEffect(() => {
        dispatch(fetchNotifications({ page: 1, page_size: 20 }));
    }, [dispatch]);

    // Load sidebar width from localStorage on mount
    useEffect(() => {
        const savedWidth = localStorage.getItem('sidebar-width');
        if (savedWidth) {
            const width = parseInt(savedWidth, 10);
            if (width >= 80 && width <= 400) {
                setSidebarWidth(width);
                if (width > 80) {
                    setLastExpandedWidth(width);
                }
            }
        }
    }, []);

    // Save sidebar width to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('sidebar-width', sidebarWidth.toString());
    }, [sidebarWidth]);

    // Global search functionality
    const performSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults({ vehicles: [], customers: [], suppliers: [] });
            setShowSearchDropdown(false);
            return;
        }

        setIsSearching(true);
        setShowSearchDropdown(true);

        try {
            const [vehiclesRes, customersRes, suppliersRes] = await Promise.all([
                vehicleService.getAllVehicles({ page: 1, limit: 5, filters:{search : query} }).catch(() => ({ data: [] })),
                customerService.searchCustomers(query).catch(() => ({ data: [] })),
                supplierService.searchSuppliers(query).catch(() => ({ data: [] }))
            ]);

            setSearchResults({
                vehicles: vehiclesRes.data || [],
                customers: customersRes.data || [],
                suppliers: suppliersRes.data || []
            });
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults({ vehicles: [], customers: [], suppliers: [] });
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Debounce search
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(query);
        }, 300);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults({ vehicles: [], customers: [], suppliers: [] });
        setShowSearchDropdown(false);
    };

    const handleResultClick = (type, id, item) => {
        setShowSearchDropdown(false);
        setSearchQuery('');

        // Navigate based on type with state to open the specific item
        if (type === 'vehicle') {
            navigate('/ordered-cars', { state: { selectedVehicle: item } });
        } else if (type === 'customer') {
            navigate('/customers', { state: { selectedCustomer: item } });
        } else if (type === 'supplier') {
            navigate('/suppliers', { state: { selectedSupplier: item } });
        }
    };

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearchDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getAvatarNameFromUsername = (user) =>{
        return user.first_name[0] + user.last_name[0];
    }

    // Sidebar resize handlers
    const handleResizeMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e) => {
            const newWidth = e.clientX;
            const clampedWidth = Math.min(Math.max(newWidth, 80), 400);
            setSidebarWidth(clampedWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Prevent text selection while resizing
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isResizing]);

    const tabs = getAccessibleTabs(permissions);

    return (
        <div className="h-screen w-screen bg-gray-100">
            {/* Sidebar - Resizable */}
            <div
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-10 flex flex-col ${
                    isResizing ? '' : 'transition-all duration-300'
                }`}
                style={{ width: `${sidebarWidth}px` }}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/tarragon.jpg"
                            alt="Tarragon.lk Logo"
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        />
                        {!sidebarCollapsed && (
                            <span className="text-xl font-bold text-gray-900">Tarragon.lk</span>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            if (sidebarWidth > 80) {
                                setLastExpandedWidth(sidebarWidth);
                                setSidebarWidth(80);
                            } else {
                                setSidebarWidth(lastExpandedWidth);
                            }
                        }}
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
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.path}
                                onClick={() => {
                                    navigate(tab.path);
                                }}
                                className={`relative w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 text-left rounded-lg transition-colors ${
                                    location.pathname === tab.path
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                                title={sidebarCollapsed ? tab.label : ''}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!sidebarCollapsed && (
                                    <div className="flex items-center justify-between flex-1">
                                        <span className="font-medium">{tab.label}</span>
                                        {tab.path === '/notifications' && unreadNotifications > 0 && (
                                            <span className="min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                                                {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {sidebarCollapsed && tab.path === '/notifications' && unreadNotifications > 0 && (
                                    <span className="absolute top-2 right-2 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User info and logout */}
                <div className="border-t border-gray-200 p-4 flex-shrink-0">
                    {!sidebarCollapsed ? (
                        <>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">{getAvatarNameFromUsername(user)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.first_name} {user.last_name} </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogoutClick}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm">Sign out</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">{getAvatarNameFromUsername(user)}</span>
                            </div>
                            <button
                                onClick={handleLogoutClick}
                                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Resize Handle - Centered grip */}
                <div
                    onMouseDown={handleResizeMouseDown}
                    className={`absolute top-1/2 -translate-y-1/2 -right-1.5 h-12 w-3 rounded-r-md flex items-center justify-center ${
                        isResizing ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                    } cursor-col-resize transition-colors z-20 shadow-md`}
                    title="Drag to resize sidebar"
                >
                    {/* Grip dots */}
                    <div className="flex flex-col gap-1">
                        <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Main content area - starts right after sidebar */}
            <div
                className={`flex flex-col min-h-screen ${isResizing ? '' : 'transition-all duration-300'}`}
                style={{ marginLeft: `${sidebarWidth}px` }}
            >
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 h-16 flex-shrink-0">
                    <div className="flex items-center justify-between h-full">
                        {/* Enhanced Global Search */}
                        <div className="flex-1 flex justify-center">
                            <div className="relative max-w-2xl w-full" ref={searchRef}>
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                                <input
                                    type="text"
                                    placeholder="Search vehicles, customers, suppliers... (Ctrl+K)"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-11 pr-20 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all"
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10">
                                    {isSearching && (
                                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                    )}
                                    {searchQuery && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <XIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    )}
                                    <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded">
                                        ⌘K
                                    </kbd>
                                </div>

                                {/* Search Results Dropdown */}
                                {showSearchDropdown && searchQuery && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                                        {!isSearching && (
                                            <>
                                                {/* Vehicles */}
                                                {searchResults.vehicles.length > 0 && (
                                                    <div className="p-3">
                                                        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                                            <Car className="w-4 h-4" />
                                                            Vehicles
                                                        </div>
                                                        {searchResults.vehicles.map((vehicle) => (
                                                            <button
                                                                key={vehicle.id}
                                                                onClick={() => handleResultClick('vehicle', vehicle.id, vehicle)}
                                                                className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between group"
                                                            >
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {vehicle.vehicle.make} {vehicle.vehicle.model}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {vehicle.vehicle.year_of_manufacture} • {vehicle.vehicle.chassis_id || 'No VIN'}
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Customers */}
                                                {searchResults.customers.length > 0 && (
                                                    <div className="p-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                                            <UserCircle className="w-4 h-4" />
                                                            Customers
                                                        </div>
                                                        {searchResults.customers.map((customer) => (
                                                            <button
                                                                key={customer.id}
                                                                onClick={() => handleResultClick('customer', customer.id, customer)}
                                                                className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-between group"
                                                            >
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {customer.customer_title} {customer.customer_name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {customer.email || customer.contact_number || 'No contact'}
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Suppliers */}
                                                {searchResults.suppliers.length > 0 && (
                                                    <div className="p-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                                            <Building2 className="w-4 h-4" />
                                                            Suppliers
                                                        </div>
                                                        {searchResults.suppliers.map((supplier) => (
                                                            <button
                                                                key={supplier.id}
                                                                onClick={() => handleResultClick('supplier', supplier.id, supplier)}
                                                                className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-between group"
                                                            >
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {supplier.supplier_name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {supplier.country} • {supplier.supplier_type}
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* No Results */}
                                                {searchResults.vehicles.length === 0 &&
                                                 searchResults.customers.length === 0 &&
                                                 searchResults.suppliers.length === 0 && (
                                                    <div className="p-8 text-center">
                                                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                        <p className="text-gray-600 font-medium">No results found</p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            Try searching with different keywords
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side icons */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/notifications')}
                                className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                    </span>
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer"
                                >
                                    <span className="text-sm font-medium text-blue-600">{getAvatarNameFromUsername(user)}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {showProfileDropdown && <ProfileDropdown user={user} setShowProfileDropdown={setShowProfileDropdown} handleLogoutClick={handleLogoutClick} /> }
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

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
                title="Sign Out"
                message="Are you sure you want to sign out?"
                confirmText="Sign Out"
                cancelText="Cancel"
                type="default"
            />
        </div>
    );
};

export default MainScreen;