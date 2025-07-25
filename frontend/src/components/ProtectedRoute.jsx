import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while checking auth status
    }

    if (!user) {
        // If not logged in, redirect to the login page
        window.location.hash = '/login';
        return null;
    }

    return children;
};

export default ProtectedRoute;