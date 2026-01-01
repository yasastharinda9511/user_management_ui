import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ message = 'Loading...', icon: Icon = Loader2 }) => {
    const isLoader2 = Icon === Loader2;

    return (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-10 flex items-center justify-center animate-in fade-in duration-200">
            <div className="text-center">
                <div className="relative inline-block mb-6">
                    {/* Pulsing background circle */}
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                    {/* Icon */}
                    <div className="relative bg-white rounded-full p-4 shadow-lg">
                        <Icon className={`w-16 h-16 text-blue-600 ${isLoader2 ? 'animate-spin' : 'animate-pulse'}`} />
                    </div>
                </div>
                <p className="text-gray-700 text-lg font-semibold">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
