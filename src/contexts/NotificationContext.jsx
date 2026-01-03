import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/common/Notification.jsx';

const NotificationContext = createContext(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        type: '',
        title: '',
        message: '',
        show: false
    });

    const showNotification = useCallback((type, title, message) => {
        setNotification({ show: true, type, title, message });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification({ show: false, type: '', title: '', message: '' });
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            <Notification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                isVisible={notification.show}
                onClose={hideNotification}
            />
        </NotificationContext.Provider>
    );
};
