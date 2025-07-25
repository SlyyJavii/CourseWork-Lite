import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import CourseList from './components/CourseList';
import TaskList from './components/TaskList';
import ReminderBanner from './components/ReminderBanner';

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

      <ReminderBanner />

      <CourseList />

      <TaskList />
    </div>
  );
};

export default App;
