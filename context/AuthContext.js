"use client";  // Ensure this runs only on the client

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    // Load role from localStorage on mount
    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, []);

    // Function to update role after login/logout
    const updateRole = (newRole) => {
        if (newRole) {
            localStorage.setItem("role", newRole);
        } else {
            localStorage.removeItem("role");
        }
        setRole(newRole);
    };

    return (
        <AuthContext.Provider value={{ role, updateRole }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);
