import React, { createContext, useContext, useState } from 'react';

const PermissionContext = createContext();

export const usePermissions = () => {
    return useContext(PermissionContext);
};

export const PermissionProvider = ({ children }) => {
    const [editPermissions, setEditPermissions] = useState(null); //Edit Permissions to check
    const [userName, setUserName] = useState(""); //Set UserName from API

    return (
        <PermissionContext.Provider value={{ editPermissions, setEditPermissions, userName, setUserName }}>
            {children}
        </PermissionContext.Provider>
    );
};
