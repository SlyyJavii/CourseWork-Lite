import React, { useEffect, useState } from 'react';

const TaskList = ({ showArchived = false }) => {
  const [tasks, setTasks] = useState([]);
  const [filterCourse, setFilterCourse] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('');


const fetchTasks = async () => {
    const token = localStorage.getItem('token');

try {
      const res = await fetch('https://coursework-lite.onrender.com/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const filteredByStatus = data.filter(task =>
        showArchived ? task.status === 'completed' : task.status === 'active'
      );
      setTasks(filteredByStatus);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [showArchived]);

  const filteredTasks = tasks
    .filter((task) =>
      filterCourse ? task.courseId === filterCourse : true
    )
    .filter((task) =>
      filterPriority ? task.priority === filterPriority : true
    )
    .sort((a, b) => {
      if (sortBy === 'dueDateAsc') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'dueDateDesc') return new Date(b.dueDate) - new Date(a.dueDate);
      return 0;
    });

    return (
    <div>
      <h2>{showArchived ? 'Archived Tasks' : 'Active Tasks'}</h2>

      {/* Filters */}
      <div style={{ marginBottom: '1rem' }}>
        <select onChange={(e) => setFilterCourse(e.target.value)} defaultValue="">
          <option value="">All Courses</option>
          {/* Replace with actual course IDs/names */}
          <option value="687ff6a15fa38a61c70f93d8">Software Engineering I</option>
          <option value="687ff6a15fa38a61c70f93dd">Calculus II</option>
          <option value="687ff6a15fa38a61c70f93e2">Database Systems</option>
          <option value="687ff6a15fa38a61c70f93e7">Intro to Art History</option>
        </select>

        <select onChange={(e) => setFilterPriority(e.target.value)} defaultValue="">
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select onChange={(e) => setSortBy(e.target.value)} defaultValue="">
          <option value="">No Sorting</option>
          <option value="dueDateAsc">Sort by Due Date ↑</option>
          <option value="dueDateDesc">Sort by Due Date ↓</option>
        </select>
      </div>

      {/* Task Display */}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.priority} — Due: {new Date(task.dueDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;