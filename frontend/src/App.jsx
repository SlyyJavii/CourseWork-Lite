import React from 'react';
import { registerUser, loginUser } from './api/auth';


const App = () => {
  const handleRegister = async () => {
    try {
      const newUser = {
      username: 'newuser123',
      email: `test${Date.now()}@email.com`, // generates unique email each time
      password: 'password123'
    };

      const res = await registerUser(newUser);
      console.log('Registered:', res);
    } catch (err) {
      console.error('Registration Error:', err.response?.data || err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const formData = {
        username: 'test' + Date.now() + '@email.com', // ← TEMP email just for demo
        password: 'password123'
      };
      const res = await loginUser(formData);
      console.log('Login success:', res);
      localStorage.setItem('token', res.access_token); // store token for later use
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
    } // Replace username with a previously registered email when testing for real.
  };


  return (
    <div style={{ padding: '2rem' }}>
      <h1>CourseWork Lite</h1>
      <button onClick={handleRegister}>Test Register</button>
      <button onClick={handleLogin}>Test Login</button>
    </div>
  );
};

export default App;
