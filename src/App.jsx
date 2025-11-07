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
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/*" element={
                    <ProtectedRoute>
                        <MainScreen/>
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
