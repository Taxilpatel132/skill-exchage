import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const token = localStorage.getItem('token');
    const value = {
        user,
        token,
        setUser,

    };


    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};