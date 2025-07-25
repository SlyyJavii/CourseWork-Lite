import React from 'react';

const getCourseNameById = (courseId, courses) => {
  const course = courses.find(c => c.id === courseId);
  return course ? course.courseName : 'Unknown Course';
};

const TaskItem = ({ task, courseName, onEditTask, onDeleteTask, onTaskStatusChange }) => {
    const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'No date';
    const isCompleted = task.status === 'complete';

    const handleCheckboxChange = () => {
        const newStatus = isCompleted ? 'active' : 'complete';
        onTaskStatusChange(task, newStatus);
    };

  return (
        <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
            <div className="task-main-info">
                <input 
                    type="checkbox" 
                    className="task-checkbox" 
                    checked={isCompleted} 
                    onChange={handleCheckboxChange} 
                />
      <span className="task-title">{task.title}</span>
            </div>
      <span className="task-due-date">{formattedDate}</span>
      <span className="task-course-name">{courseName}</span>
            <div className="task-actions">
                <button onClick={() => onEditTask(task)} className="action-button edit-button" title="Edit Task">✏️</button>
                <button onClick={() => onDeleteTask(task.id)} className="action-button delete-button" title="Delete Task">🗑️</button>
            </div>
    </div>
  );
};

const TaskList = ({ tasks, courses, onAddTask, onEditTask, onDeleteTask, onTaskStatusChange }) => {
  return (
    <main className="task-list-container">
      <div className="task-list-main-header">
        <h2>Tasks</h2>
        <button onClick={onAddTask} className="add-button">
          + Add Task
        </button>
      </div>
      <div className="task-list-column-headers">
        <h3>Task</h3>
        <h3>Due Date</h3>
        <h3>Course</h3>
        <h3>Actions</h3>
      </div>
      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              courseName={getCourseNameById(task.courseId, courses)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onTaskStatusChange={onTaskStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>You're all caught up!</h3>
          <p>No tasks to display. Why not add one?</p>
        </div>
      )}
    </main>
  );
};

export default TaskList;