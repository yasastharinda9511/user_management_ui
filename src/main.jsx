import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./state/store";
import { HelmetProvider } from 'react-helmet-async';
import { NotificationProvider } from './contexts/NotificationContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </Provider>
        </HelmetProvider>
    </StrictMode>
)
