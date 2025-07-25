import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

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
  }, [user, route]);


  switch (route) {
    case '#/login':
      return <LoginPage />;
    case '#/register':
      return <RegisterPage />;
    case '#/dashboard':
      return <ProtectedRoute><Dashboard /></ProtectedRoute>;
    default:
      return <LandingPage />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <SimpleRouter />
        </div>
      </div>
    </AuthProvider>
  );
}