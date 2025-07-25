import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome! You are logged in.</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;