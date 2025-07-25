import React, { useState, useEffect } from 'react';
import TaskFilter from './TaskFilter';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    course: '',
    priority: '',
    courseOptions: []
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      const taskRes = await fetch('https://coursework-lite.onrender.com/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const taskData = await taskRes.json();
      setTasks(taskData);

      const courseRes = await fetch('https://coursework-lite.onrender.com/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const courseData = await courseRes.json();
      setCourses(courseData);
      setFilters((prev) => ({ ...prev, courseOptions: courseData }));
    };

    fetchData();
  }, [token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchCourse = filters.course ? task.courseId === filters.course : true;
    const matchPriority = filters.priority ? task.priority === filters.priority : true;
    return matchCourse && matchPriority;
  });

  return (
    <div>
      <TaskFilter filters={filters} onFilterChange={handleFilterChange} />

      <h2>Your Tasks</h2>
      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> – {task.priority}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
