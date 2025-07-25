import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // TODO: Replace with actual API fetch
    const fetchTasks = async () => {
      const dummyTasks = [
        { id: 1, title: "Submit Assignment", completed: false },
        { id: 2, title: "Grade Submissions", completed: true },
        { id: 3, title: "Update Syllabus", completed: false },
      ];
      setTasks(dummyTasks);
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return filter === "completed" ? task.completed : !task.completed;
  });

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "active" : ""}
        >
          Pending
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? "done" : ""}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
