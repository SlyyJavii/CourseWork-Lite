import React, { useState, useContext, createContext, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To check initial auth status

    useEffect(() => {
        // This effect runs once when the app starts to check if a token is stored.
        // This keeps the user logged in even if they refresh the page.
        const token = localStorage.getItem('token');
        if (token) {
            // Here you might want to add a call to a '/users/me' endpoint
            // to verify the token and get fresh user data.
            // For now, we'll assume the token means the user is logged in.
            // A placeholder user object can be set here.
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // This function will be called by our Login component.
        const formData = new URLSearchParams();
        formData.append('username', email); // Backend expects email in the 'username' field
        formData.append('password', password);

        const response = await apiClient.post('/users/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        setUser({ token: access_token });
        return response.data;
    };

    const register = async (username, email, password) => {
        // This function will be called by our Register component.
        const response = await apiClient.post('/users/register', {
            username,
            email,
            password,
        });
        return response.data;
    };

    const logout = () => {
        // Clears the user state and removes the token from storage.
        localStorage.removeItem('token');
        setUser(null);
    };

    // The value provided by the context to all child components.
    const authContextValue = { user, login, register, logout, loading };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};