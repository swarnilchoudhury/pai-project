import React from 'react';
import SomethingWentWrongSnackBar from '../SnackBar/SomethingWentWrong';
import { SnackBarProvider } from '../../Context/SnackBarContext';

const SnackBarProviders = ({ children }) => {
    return (
        <SnackBarProvider>
            <SomethingWentWrongSnackBar />
            {children}
        </SnackBarProvider>
    );
};

export default SnackBarProviders;
