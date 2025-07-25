import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AccountSettingsPage from './pages/AccountSettingsPage';

const SimpleRouter = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  useEffect(() => {
    const publicRoutes = ['#/', '#/login', '#/register'];
    if (user && publicRoutes.includes(route)) {
      window.location.hash = '/dashboard';
    }
    if (!user && route === '#/dashboard') {
      window.location.hash = '/login';
    }
  }, [user, route]);


  switch (route) {
    case '#/login':
      return <LoginPage />;
    case '#/register':
      return <RegisterPage />;
    case '#/dashboard':
      return <ProtectedRoute><Dashboard /></ProtectedRoute>;
    case '#/account':
      return <ProtectedRoute><AccountSettingsPage /></ProtectedRoute>;
    default:
      return user ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <LandingPage />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <SimpleRouter />
    </AuthProvider>
  );
}