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
    Key,
    Ship,
    Car,
    UserCircle,
    ShoppingCart,
    Building2
} from 'lucide-react';
import {PERMISSIONS} from "../../utils/permissions.js";

export const allTabs = [
    { path: '/ordered-cars', label: 'Ordered cars', icon: User, requiredPermission: PERMISSIONS.CAR_TAB_ACCESS },
    { path: '/shipping-tracking', label: 'Shipping Tracking', icon: Ship, requiredPermission: PERMISSIONS.CAR_TAB_ACCESS },
    { path: '/purchase-tracking', label: 'Purchase Tracking', icon: ShoppingCart , requiredPermission: PERMISSIONS.CAR_TAB_ACCESS },
    { path: '/makes', label: 'Makes', icon: Car, requiredPermission: PERMISSIONS.CAR_TAB_ACCESS },
    { path: '/customers', label: 'Customers', icon: UserCircle, requiredPermission: PERMISSIONS.CUSTOMER_TAB_ACCESS },
    { path: '/suppliers', label: 'Suppliers', icon: Building2, requiredPermission: PERMISSIONS.SUPPLIER_TAB_ACCESS },
    { path: '/dashboard', label: 'Dashboard', icon: Home, requiredPermission: PERMISSIONS.CAR_TAB_ACCESS },
    { path: '/notifications', label: 'Notifications', icon: Bell, requiredPermission: PERMISSIONS.NOTIFICATIONS_TAB_ACCESS },
    { path: '/users', label: 'Users', icon: Users , requiredPermission: PERMISSIONS.USER_TAB_ACCESS},
    { path: '/roles', label: 'Roles', icon: Shield , requiredPermission: PERMISSIONS.ROLE_TAB_ACCESS },
    { path: '/permissions', label: 'Permissions', icon: Key , requiredPermission: PERMISSIONS.PERMISSIONS_TAB_ACCESS },
    { path: '/profile', label: 'Profile', icon: User , requiredPermission: PERMISSIONS.PROFILE_TAB_ACCESS },
    // { path: '/analytics', label: 'Analytics', icon: BarChart3, requiredPermission: PERMISSIONS.ANALYTICS_TAB_ACCESS },
    { path: '/settings', label: 'Settings', icon: Settings , requiredPermission: PERMISSIONS.SETTINGS_TAB_ACCESS},

];