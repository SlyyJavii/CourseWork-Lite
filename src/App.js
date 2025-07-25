import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import CourseList from './components/CourseList';
import TaskList from './components/TaskList';
import ReminderBanner from './components/ReminderBanner';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('courses'); // can be: 'courses', 'tasks', 'archived'

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <LoginForm onLoginSuccess={handleLoginSuccess} />;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>CourseWork Lite</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('courses')}>Courses</button>
        <button onClick={() => setActiveTab('tasks')}>Tasks</button>
        <button onClick={() => setActiveTab('archived')}>Archived</button>
        <button onClick={handleLogout} style={{ float: 'right' }}>Log Out</button>
      </div>

      <ReminderBanner />

      {activeTab === 'courses' && <CourseList />}
      {activeTab === 'tasks' && <TaskList showArchived={false} />}
      {activeTab === 'archived' && <TaskList showArchived={true} />}
    </div>
  );
};

export default App;
