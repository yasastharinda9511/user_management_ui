import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../state/authSlice.js";
import {registerUser} from "../state/userRegistrationSlice.js";

const LoginPage = () => {

    const  dispatch = useDispatch();
    const { isLoading: authLoading, message} = useSelector((state) => state.auth);
    const {user, isLoading: registerLoading} = useSelector((state) => state.registerUser);

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation , setShowConfirmation] = useState(false);

    // Login form state
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    // Register form state
    const [registerForm, setRegisterForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: ''
    });

    const handleLoginChange = (e) => {
        const {name, value} = e.target;
        setLoginForm(prev => ({...prev, [name]: value}));
    }

    const handleRegisterChange = (e) => {
        const {name, value} = e.target;
        setRegisterForm(prev => ({...prev, [name]: value}));
    }

    // Clear messages when switching between login/register
    const handleLogin = async (e) => {

        console.log("Called this login async function !!!");
        if (e?.preventDefault) e.preventDefault();

        // Dispatch the async thunk
        const result = await dispatch(loginUser({
            email: loginForm.email,
            password: loginForm.password
        }));

        // Handle success case
        if (loginUser.fulfilled.match(result)) {
            // Redirect logic here
            console.log("loged Sucessfully !!!!!")
            setTimeout(() => {
                // You can dispatch another action or handle redirect
                console.log('Redirecting to dashboard...');
            }, 1000);
        }
    };

    const handleRegister = async (e) => {
        if (e?.preventDefault) e.preventDefault();

        const result = await dispatch(registerUser({
            username: registerForm.username,
            email: registerForm.email,
            password:registerForm.password,
            first_name: registerForm.firstName,
            last_name: registerForm.lastName,
            phone: registerForm.phone,
        }));

        if (registerUser.fulfilled.match(result)) {
            setShowConfirmation(true);
            setTimeout(() => {
            }, 1000);
        }
    }

    const closeConfirmation = ()=>{
        setShowConfirmation(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            {showConfirmation && (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-sm w-full mx-4 p-6 relative">
                        {/* Close button */}
                        <button
                            onClick={closeConfirmation}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                        </button>

                        {/* Success content */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <CheckCircle className="w-8 h-8 text-blue-600" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                Account Created!
                            </h2>

                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                Welcome <span className="font-semibold text-gray-900">{user?.username || 'to our platform'}</span>!
                                Your account has been created successfully.
                            </p>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <p className="text-xs text-blue-800">
                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                    Auto-closing in a few seconds
                                </p>
                            </div>

                            <button
                                onClick={closeConfirmation}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                            >
                                Continue to Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        User Management
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Tab Switcher */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                                isLogin
                                    ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-500'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                                !isLogin
                                    ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-500'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        {/* Alert Messages */}
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                                message.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span className="text-sm">{message.text}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        {isLogin ? (
                            <div className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={loginForm.email}
                                            onChange={handleLoginChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={loginForm.password}
                                            onChange={handleLoginChange}
                                            required
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleLogin}
                                    disabled={authLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {authLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                        ) : (
                            /* Register Form */
                            <div className="space-y-6">
                                {/* Username Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="username"
                                            value={registerForm.username}
                                            onChange={handleRegisterChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                            placeholder="Choose a username"
                                        />
                                    </div>
                                </div>

                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={registerForm.firstName}
                                            onChange={handleRegisterChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={registerForm.lastName}
                                            onChange={handleRegisterChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={registerForm.email}
                                            onChange={handleRegisterChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={registerForm.phone}
                                        onChange={handleRegisterChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* Password Fields */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={registerForm.password}
                                                onChange={handleRegisterChange}
                                                required
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                placeholder="Create a password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={registerForm.confirmPassword}
                                                onChange={handleRegisterChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                placeholder="Confirm your password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Password Strength Indicator */}
                                {registerForm.password && (
                                    <div className="text-xs text-gray-600">
                                        Password strength: {
                                        registerForm.password.length < 8 ?
                                            <span className="text-red-500">Weak</span> :
                                            registerForm.password.length < 12 ?
                                                <span className="text-yellow-500">Medium</span> :
                                                <span className="text-green-500">Strong</span>
                                    }
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleRegister}
                                    disabled={registerLoading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {registerLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className={`font-medium hover:underline ${
                                        isLogin ? 'text-purple-600' : 'text-blue-600'
                                    }`}
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;