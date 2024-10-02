import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

//  Create a Context for permissions
const PermissionContext = createContext();

//  Custom hook to use the PermissionContext
export const usePermissions = () => {
    return useContext(PermissionContext);
};

//  Provider component
export const PermissionProvider = ({ children }) => {

    // Props validations
    PermissionProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };

    //  Define state variables
    const [editPermissions, setEditPermissions] = useState(null); //  Edit Permissions to check
    const [userName, setUserName] = useState(""); //  Set UserName from API

    //  Memorize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        editPermissions,
        setEditPermissions,
        userName,
        setUserName
    }), [editPermissions, userName]);

    return (
        <PermissionContext.Provider value={contextValue}>
            {children}
        </PermissionContext.Provider>
    );
};

