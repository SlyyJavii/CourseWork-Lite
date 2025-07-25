import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label>Username
          <input type="text" name="username" required value={formData.username} onChange={handleChange} />
        </label>

        <label>Email
          <input type="email" name="email" required value={formData.email} onChange={handleChange} />
        </label>

        <label>Password
          <input type="password" name="password" required value={formData.password} onChange={handleChange} />
        </label>

        <button type="submit">Create Account</button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Account created! Redirecting to login...</p>}
      </form>
    </div>
  );
};

export default Register;