import React, { createContext, useContext, useState, useEffect } from 'react';
import { userServices } from '../services/auth.api';
import type { ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    userRole: string | null;
    userEmail: string | null;
    isRegistered: boolean;
    login: () => Promise<void>;
    logout: () => void;
    register: () => void;
    verified: () => void;
}

//To store a global state of autorization
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    const register = () => setIsRegistered(true);
    const verified = () => setIsRegistered(false);
    
    useEffect(() => {
        async function CheckAuth() {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await userServices.validate();
                const data = response.data;

                setIsAuthenticated(true);
                setUserEmail(data.username);
                setUserRole(data.role);
            } catch {
                setIsAuthenticated(false);
                setUserEmail(null);
                setUserRole(null);
                localStorage.removeItem("token");
            } finally {
                setIsLoading(false);
            }
        }

        CheckAuth();
    }, []);

    //sets the login status locally
    const login = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsAuthenticated(true);
    };

    //Deletes the login status and clean the token from locally memory
    const logout = (): void => {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserRole(null);
        localStorage.removeItem("token");
    }

    //Value contains all the data and functions for component's children
    //Thanks to it, in all React can be done for example: const { isAuthenticated, userRole } = useAuth();
    return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userEmail, userRole, login, logout, isRegistered, register, verified }}>
      {children}
    </AuthContext.Provider>
  );

}

//Simple hook to download context in every component
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth musi być wewnątrz AuthProvider');
    return context;
};

