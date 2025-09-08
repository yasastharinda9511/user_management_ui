import React, { useState, useEffect } from 'react';
import SelectedCarCard from "../tabs/orderedCars/SelectedCarCard.jsx";

const Notification = ({
                          type = 'error',
                          title,
                          message,
                          isVisible,
                          onClose,
                          autoClose = true,
                          duration = 5000
                      }) => {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        setShow(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (show && autoClose) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, autoClose, duration]);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300); // Wait for animation to complete
    };

    const getNotificationStyles = () => {
        const baseStyles = "fixed top-4 right-4 max-w-md w-full p-4 rounded-lg shadow-lg z-[9999] transition-all duration-300 transform";

        const typeStyles = {
            error: "bg-red-50 border-l-4 border-red-500 text-red-800",
            success: "bg-green-50 border-l-4 border-green-500 text-green-800",
            warning: "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800",
            info: "bg-blue-50 border-l-4 border-blue-500 text-blue-800"
        };

        const animationStyles = show
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95";

        return `${baseStyles} ${typeStyles[type]} ${animationStyles}`;
    };

    const getIconForType = () => {
        const icons = {
            error: (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            ),
            success: (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            warning: (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            ),
            info: (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            )
        };
        return icons[type];
    };

    if (!isVisible && !show) return null;

    return (
        <div className={getNotificationStyles()}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {getIconForType()}
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className="text-sm font-medium mb-1">
                            {title}
                        </h3>
                    )}
                    <p className="text-sm">
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={handleClose}
                        className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notification;