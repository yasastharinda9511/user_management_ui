import './App.css'
import LoginPage from "./components/LoginPage.jsx";
import MainScreen from "./components/MainScreen.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {
    loadUserFromStorage,
    introspectUser
} from "./state/authSlice.js";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DefaultRedirect from "./components/DefaultRedirect.jsx";
import Profile from "./components/tabs/profile/Profile.jsx";
import OrderedCars from "./components/tabs/orderedCars/OrderedCars.jsx";
import DashBoard from "./components/tabs/dashBoard/dashBoard.jsx";
import Analytics from "./components/tabs/analytics/Analytics.jsx";
import Settings from "./components/tabs/settings/Settings.jsx";
import Users from "./components/tabs/users/Users.jsx";
import Roles from "./components/tabs/roles/Roles.jsx";
import Permissions from "./components/tabs/permissions/Permissions.jsx";
import ShippingTracking from "./components/tabs/shippingTracking/ShippingTracking.jsx";
import Makes from "./components/tabs/makes/Makes.jsx";
import Customers from "./components/tabs/customers/Customers.jsx";
import Suppliers from "./components/tabs/suppliers/Suppliers.jsx";
import PurchaseTracking from "./components/tabs/purchaseTracking/PurchaseTracking.jsx";
import Notifications from "./components/tabs/notifications/Notifications.jsx";
import PublicVehicleView from "./components/PublicVehicleView.jsx";
import settingsService from "./utils/settingsService.js";

function App() {
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const accessToken = useSelector(state => state.auth.accessToken);

    // Initialize dark mode on app load
    useEffect(() => {
        const darkMode = settingsService.getSetting('darkMode');
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(loadUserFromStorage());
        }
    }, [])

    useEffect(()=>{
        if (accessToken) {
            dispatch(introspectUser(accessToken));
        }

    }, [accessToken])

    return (
        <BrowserRouter basename="/car-app">
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/share/:shareToken" element={<PublicVehicleView/>} />

                {/* Protected Routes - Each route is explicitly wrapped with ProtectedRoute */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainScreen/>
                    </ProtectedRoute>
                }>
                    <Route index element={<DefaultRedirect />} />
                    <Route path="dashboard" element={<DashBoard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="ordered-cars" element={<OrderedCars />} />
                    <Route path="shipping-tracking" element={<ShippingTracking />} />
                    <Route path="purchase-tracking" element={<PurchaseTracking />} />
                    <Route path="makes" element={<Makes />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="users" element={<Users />} />
                    <Route path="roles" element={<Roles />} />
                    <Route path="permissions" element={<Permissions />} />
                    {/*<Route path="analytics" element={<Analytics />} />*/}
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch all - redirect to first accessible path */}
                <Route path="*" element={
                    <ProtectedRoute>
                        <DefaultRedirect />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
