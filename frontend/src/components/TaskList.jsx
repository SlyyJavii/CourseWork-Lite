import React from 'react';

const getCourseNameById = (courseId, courses) => {
  const course = courses.find(c => c.id === courseId);
  return course ? course.courseName : 'Unknown Course';
};

const TaskItem = ({ task, courseName }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'No date';

  return (
    // The TaskItem is now a single row that aligns with the header columns.
    <div className="task-item">
      <span className="task-title">{task.title}</span>
      <span className="task-due-date">{formattedDate}</span>
      <span className="task-course-name">{courseName}</span>
    </div>
  );
};

const TaskList = ({ tasks, courses }) => {
  return (
    <main className="task-list-container">
      <div className="task-list-header">
        {/* These headers now correctly align with the TaskItem columns */}
        <h3>Task</h3>
        <h3>Due Date</h3>
        <h3>Course</h3>
      </div>
      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              courseName={getCourseNameById(task.courseId, courses)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>You're all caught up!</h3>
          <p>No tasks to display for this course.</p>
        </div>
      )}
    </main>
  );
};

export default TaskList;