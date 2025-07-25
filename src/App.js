import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import CourseList from './components/CourseList';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <h1>CourseWork Lite</h1>
      <button onClick={handleLogout}>Log Out</button>
      <CourseList />
    </div>
  );
};

export default App;
