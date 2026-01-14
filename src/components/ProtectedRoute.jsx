import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isInitializing = useSelector((state) => state.auth.isInitializing);

    // Show loading while checking authentication
    if (isInitializing) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="relative mb-6">
                    {/* Pulsing background circle */}
                    <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 rounded-full animate-ping opacity-75"></div>
                    {/* Spinner */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
