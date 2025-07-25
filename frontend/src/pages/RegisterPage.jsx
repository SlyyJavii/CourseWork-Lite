import React from 'react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(username, email, password);
      setSuccess('Registration successful! You can now log in.');
      // Optionally, redirect to login page after a delay
      setTimeout(() => window.location.hash = '/login', 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create an Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="submit-button register-button">
          Create Account
        </button>
      </form>
      <p className="form-footer">
        Already have an account?{' '}
        <a href="#/login">
          Log in
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;