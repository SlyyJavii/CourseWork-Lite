import React, { useEffect, useState } from 'react';

const ReminderBanner = () => {
  const [reminderTasks, setReminderTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://coursework-lite.onrender.com/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch tasks');
      const tasks = await res.json();

      const now = new Date();
      const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      const filtered = tasks.filter((task) => {
        const due = new Date(task.dueDate);
        return due < soon && task.status === 'active';
      });

      setReminderTasks(filtered);
    } catch (err) {
      console.error('Reminder fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return null;
  if (reminderTasks.length === 0) return null;

  return (
    <div style={styles.banner}>
      <h3>Upcoming or Overdue Tasks</h3>
      <ul>
        {reminderTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> (Due: {new Date(task.dueDate).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#ffeeba',
    padding: '1rem',
    margin: '1rem 0',
    border: '1px solid #ffc107',
    borderRadius: '8px',
  },
};

export default ReminderBanner;
