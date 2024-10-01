import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

//  Create a Context for DialogBox
const DialogBoxContext = createContext();

//  Custom hook to use the DialogBoxContext
export const useDialogBox = () => {
    return useContext(DialogBoxContext);
};

//  Provider component
export const DialogBoxProvider = ({ children }) => {

    // Props validations
    DialogBoxProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };

    //  Define state variables
    const [showDialogBoxContent, setShowDialogBoxContent] = useState({
        dialogTextContent: "", 
        dialogTextTitle: "",
        dialogTextButton: "",
        showCancelBtn: false,
        showDefaultButton: true,
        showButtons: true,
        dialogTextButtonOnConfirmId: "",
        dialogTextButtonOnConfirm: "",
        clickFunctionsOnConfirmFunction: null
    });

    return (
        <DialogBoxContext.Provider value={{ showDialogBoxContent, setShowDialogBoxContent }}>
            {children}
        </DialogBoxContext.Provider>
    );
};

