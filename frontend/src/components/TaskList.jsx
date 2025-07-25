import React from 'react';
import {CSSTransition,TransitionGroup} from 'react-transition-group';

const getCourseNameById = (courseId, courses) => {
  const course = courses.find(c => c.id === courseId);
  return course ? course.courseName : 'Unknown Course';
};

const TaskItem = React.forwardRef((props,ref) => {
  const { task, courseName, onEditTask, onDeleteTask, onTaskStatusChange } = props;

  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date';
  const isCompleted = task.status === 'complete';

  const handleCheckboxChange = () => {
      const newStatus = isCompleted ? 'active' : 'complete';
      onTaskStatusChange(task, newStatus);
  };

  return (
    <div className="task-item" ref={ref}>
            <div className="task-main-info">
                <input 
                    type="checkbox" 
                    className="task-checkbox" 
                    checked={isCompleted} 
                    onChange={handleCheckboxChange} 
                />
                <span className={`task-title ${isCompleted ? 'completed-text' : ''}`}>{task.title}</span>
      </div>
      <span className="task-due-date">{formattedDate}</span>
      <span className={`task-priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      <span className="task-course-name">{courseName}</span>
            <div className="task-actions">
                <button onClick={() => onEditTask(task)} className="action-button edit-button" title="Edit Task">✏️</button>
                <button onClick={() => onDeleteTask(task.id)} className="action-button delete-button" title="Delete Task">🗑️</button>
            </div>
    </div>
  );
});

// SortableHeader component to reduce repetition
const SortableHeader = ({ children, sortKey, sortConfig, onSort }) => {
  const isSorted = sortConfig.key === sortKey;
  const directionIcon = sortConfig.direction === 'ascending' ? '▲' : '▼';

  return (
    <button className="sortable-header" onClick={() => onSort(sortKey)}>
      {children}
      {isSorted && <span className="sort-icon">{directionIcon}</span>}
    </button>
  );
};

const TaskList = ({ tasks, courses, onAddTask, onEditTask, onDeleteTask, onTaskStatusChange,sortConfig,onSort }) => {
  return (
    <main className="task-list-container">
      <div className="task-list-main-header">
        <h2>Tasks</h2>
        <button onClick={onAddTask} className="add-button">
          + Add Task
        </button>
      </div>
      <div className="task-list-column-headers">
        <SortableHeader sortKey="title" sortConfig={sortConfig} onSort={onSort}>Task</SortableHeader>
        <SortableHeader sortKey="dueDate" sortConfig={sortConfig} onSort={onSort}>Due Date</SortableHeader>
        <SortableHeader sortKey="priority" sortConfig={sortConfig} onSort={onSort}>Priority</SortableHeader>
        <h3>Course</h3>
        <h3>Actions</h3>
      </div>
      {tasks.length > 0 ? (
        <TransitionGroup className="task-list">
          {tasks.map(task => {
            const nodeRef = React.createRef(null);
            return (
              <CSSTransition
                  key={task.id}
                timeout={500}
                classNames="task-item-animation"
                nodeRef={nodeRef}
              >
                <TaskItem 
                  ref={nodeRef}
                  task={task} 
                  courseName={getCourseNameById(task.courseId, courses)}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  onTaskStatusChange={onTaskStatusChange}
                />
              </CSSTransition>
          );
          })}
        </TransitionGroup>
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