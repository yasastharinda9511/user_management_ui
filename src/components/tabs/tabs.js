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

export const allTabs = [
    { path: '/ordered-cars', label: 'Ordered cars', icon: User, requiredPermission: 'vehicles.access' },
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/roles', label: 'Roles', icon: Shield },
    { path: '/permissions', label: 'Permissions', icon: Key },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, requiredPermission: 'analytics.access' },
    { path: '/settings', label: 'Settings', icon: Settings },
];