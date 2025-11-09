import './App.css'
import LoginPage from "./components/LoginPage.jsx";
import MainScreen from "./components/MainScreen.jsx";
import {useDispatch, useSelector} from "react-redux";
import {use, useEffect} from "react";
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

function App() {
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const accessToken = useSelector(state => state.auth.accessToken);

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(loadUserFromStorage());
        }
    }, [])

    useEffect(()=>{
        if (accessToken) {
            console.log("accessToken", accessToken);
            dispatch(introspectUser(accessToken));
        }

    }, [accessToken])

    return (
        <BrowserRouter basename="/car-app">
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage/>} />

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
                    <Route path="users" element={<Users />} />
                    <Route path="roles" element={<Roles />} />
                    <Route path="permissions" element={<Permissions />} />
                    <Route path="analytics" element={<Analytics />} />
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
