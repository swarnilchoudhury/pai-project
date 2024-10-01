import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { PermissionProvider } from "./Context/PermissionContext";
import SnackBarProviders from './Providers/SnackBarProvider';
import DialogBoxProviders from './Providers/DialogBoxProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <PermissionProvider>
            <DialogBoxProviders>
                <SnackBarProviders>
                    <App />
                </SnackBarProviders>
            </DialogBoxProviders>
        </PermissionProvider>
    </BrowserRouter>
);


