import React from "react";
import "../styles/Task.css";

const Tasks = () => {
  return (
    <div className="tasks-container">
      <h2>Your Tasks</h2>
      <p>Here’s where we’ll show upcoming tasks, deadlines, and maybe even completion status.</p>

      <div className="task-list">
        <div className="task-card">
          <h3>Sample Task 1</h3>
          <p>Due: Aug 5</p>
          <p>Status: In Progress</p>
        </div>
        <div className="task-card">
          <h3>Sample Task 2</h3>
          <p>Due: Aug 10</p>
          <p>Status: Not Started</p>
        </div>
        {/* Add more dynamic tasks later when I wire up the backend */}
      </div>
    </div>
  );
};

export default Tasks;