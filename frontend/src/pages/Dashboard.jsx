import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('all'); // 'all' by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // This useEffect hook is the core of our data fetching.
  // It runs once when the component first mounts.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // We use Promise.all to make both API calls concurrently for better performance.
        const [coursesResponse, tasksResponse] = await Promise.all([
          apiClient.get('/courses/'),
          apiClient.get('/tasks/'),
        ]);

        setCourses(coursesResponse.data);
        setTasks(tasksResponse.data);
        setError('');
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array [] means this effect runs only once.

  // This derived state filters the tasks based on the selected course.
  // This logic runs every time 'tasks' or 'selectedCourseId' changes.
  const filteredTasks = selectedCourseId === 'all'
    ? tasks
    : tasks.filter(task => task.courseId === selectedCourseId);

  if (loading) {
    return <div className="loading-message">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>My Dashboard</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </header>
      <div className="dashboard-main-content">
        <Sidebar
          courses={courses}
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
        />
        <TaskList tasks={filteredTasks} courses={courses} />
      </div>
    </div>
  );
};

export default Dashboard;