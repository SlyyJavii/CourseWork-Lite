import React, { useState, useEffect, useMemo } from 'react';
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
import EditTaskModal from '../components/EditTaskModal';

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

  const [showArchived, setShowArchived] = useState(false);
  const [sortConfig,setSortConfig] = useState({key: 'title',direction: 'ascending'});

  // Manage state for modals
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);

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
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // The empty dependency array [] means this effect runs only once.

  // Handlers for adding, editing, and deleting courses and tasks.
  // These functions update the state and handle the logic for adding, editing, and deleting courses
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

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsEditTaskModalOpen(true);
  };

  const handleCourseUpdated = (updatedCourse) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
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

  const handleTaskDeleted = async (taskId) => {
     if (window.confirm("Are you sure you want to delete this task?")) {
        try {
            await apiClient.delete(`/tasks/${taskId}`);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            setError("Failed to delete task.");
        }
     }
  };

  const handleTaskStatusChange = async (task, newStatus) => {
    try {
        const response = await apiClient.put(`/tasks/${task.id}`, { status: newStatus });
        handleTaskUpdated(response.data);
    } catch (err) {
        setError("Failed to update task status.");
    }
  };


  // --- Sorting and Filtering Logic ---
  // This useMemo hook is used to optimize the sorting and filtering of tasks.
  // It recalculates the sorted and filtered tasks only when tasks, selectedCourseId,
  // showArchived, or sortConfig changes.
  // This prevents unnecessary recalculations on every render, improving performance.
  const sortedAndFilteredTasks = useMemo(() => {
    // 1. Filter tasks by archive status and selected course first.
    let filtered = tasks
      .filter(task => {
        const desiredStatus = showArchived ? 'complete' : 'active';
        return task.status === desiredStatus;
      })
      .filter(task => {
        if (selectedCourseId === 'all') return true;
        return task.courseId === selectedCourseId;
      });

    // 2. Sort the filtered tasks.
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle different data types for sorting
      if (sortConfig.key === 'dueDate') {
        aValue = a.dueDate ? new Date(a.dueDate) : new Date(0); // Handle null dates
        bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
      } else if (sortConfig.key === 'priority') {
        const priorityMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
        aValue = priorityMap[a.priority] || 0;
        bValue = priorityMap[b.priority] || 0;
      }

      // Comparison logic
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [tasks, selectedCourseId, showArchived, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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
            showArchived={showArchived}
            onToggleArchived={() => setShowArchived(!showArchived)}
          />
          <TaskList
            tasks={sortedAndFilteredTasks}
            courses={courses}
            onAddTask={() => setIsAddTaskModalOpen(true)}
            onEditTask={handleEditTask}
            onDeleteTask={handleTaskDeleted}
            onTaskStatusChange={handleTaskStatusChange}
            sortConfig={sortConfig}
            onSort={handleSort}
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
      {isEditTaskModalOpen && (
        <EditTaskModal 
          task={taskToEdit} 
          courses={courses} 
          onClose={() => setIsEditTaskModalOpen(false)} 
          onTaskUpdated={handleTaskUpdated} 
        />
      )}
    </>
  );
};

export default Dashboard;