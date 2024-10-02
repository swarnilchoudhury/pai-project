import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

//  Create a Context for SnackBar
const SnackBarContext = createContext();

//  Custom hook to use the SnackBarContext
export const useSnackBar = () => {
    return useContext(SnackBarContext);
};

//  Provider component
export const SnackBarProvider = ({ children }) => {

    // Props validations
    SnackBarProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };

    //  Define state variables
    const [showSomethingWentWrong, setSomethingWentWrong] = useState(false);

    return (
        <SnackBarContext.Provider value={{ showSomethingWentWrong, setSomethingWentWrong }}>
            {children}
        </SnackBarContext.Provider>
    );
};

