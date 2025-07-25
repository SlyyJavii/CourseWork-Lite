import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

// Importing components for the dashboard layout.
// Sidebar for course selection and TaskList for displaying tasks.
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
// Importing modals for adding courses and tasks.
// These modals will be used to create new courses and tasks directly from the dashboard.
import AddCourseModal from '../components/AddCourseModal';
import AddTaskModal from '../components/AddTaskModal';
import EditCourseModal from '../components/EditCourseModal';

// Importing styles specific to the Dashboard component.
// This CSS file contains styles for the dashboard layout, header, and other elements.  
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth(); // Assuming useAuth is imported
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Manage state for modals
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null); // Track which course is being edited

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
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // The empty dependency array [] means this effect runs only once.

  const handleCourseAdded = (newCourse) => {
    setCourses(prevCourses => [...prevCourses, newCourse]);
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setIsEditCourseModalOpen(true);
  };

  const handleCourseUpdated = (updatedCourse) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  const handleCourseDeleted = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course and all its tasks? This action cannot be undone.")) {
      try {
        await apiClient.delete(`/courses/${courseId}`);
        // Remove the deleted course from the state
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        // Remove all tasks associated with the deleted course
        setTasks(prevTasks => prevTasks.filter(task => task.courseId !== courseId));
        // If the deleted course was selected, reset selection to 'all'
        if (selectedCourseId === courseId) {
          setSelectedCourseId('all');
        }
      } catch (err) {
        setError("Failed to delete course.");
      }
    }
  };


  const filteredTasks = selectedCourseId === 'all'
    ? tasks
    : tasks.filter(task => task.courseId === selectedCourseId);

  if (loading) return <div className="loading-message">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <div className="dashboard-layout">
        <header className="dashboard-header">
          <h1>My Dashboard</h1>
          <button onClick={logout} className="logout-button">Logout</button>
        </header>
        <div className="dashboard-main-content">
          <Sidebar
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onAddCourse={() => setIsAddCourseModalOpen(true)}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleCourseDeleted}
          />
          <TaskList
            tasks={filteredTasks}
            courses={courses}
            onAddTask={() => setIsAddTaskModalOpen(true)}
          />
        </div>
      </div>

      {isAddCourseModalOpen && (
        <AddCourseModal
          onClose={() => setIsAddCourseModalOpen(false)}
          onCourseAdded={handleCourseAdded}
        />
      )}
      {isAddTaskModalOpen && (
        <AddTaskModal
          courses={courses}
          // Pass the currently selected course ID to the modal
          selectedCourseId={selectedCourseId}
          onClose={() => setIsAddTaskModalOpen(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
      {isEditCourseModalOpen && (
        <EditCourseModal
          course={courseToEdit}
          onClose={() => setIsEditCourseModalOpen(false)}
          onCourseUpdated={handleCourseUpdated}
        />
      )}
    </>
  );
};

export default Dashboard;