import React from 'react';
import SomethingWentWrongSnackBar from '../Components/SnackBar/SomethingWentWrong';
import { SnackBarProvider } from '../Context/SnackBarContext';

const SnackBarProviders = ({ children }) => {
    return (
        <SnackBarProvider>
            <SomethingWentWrongSnackBar />
            {children}
        </SnackBarProvider>
    );
};

export default SnackBarProviders;
