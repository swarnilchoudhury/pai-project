import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { PermissionProvider } from "./Context/PermissionContext";
import SnackBarProviders from './Components/Providers/SnackBarProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <PermissionProvider>
            <SnackBarProviders>
                <App />
            </SnackBarProviders>
        </PermissionProvider>
    </BrowserRouter>
);


