import React from 'react';
import { DialogBoxProvider } from '../Context/DialogBoxContext';
import DialogBoxes from '../Components/DialogBoxes/DialogBoxes';

const DialogBoxProviders = ({ children }) => {
    return (
        <DialogBoxProvider>
            <DialogBoxes />
            {children}
        </DialogBoxProvider>
    );
};

export default DialogBoxProviders;
