import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Course from "./pages/Course";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Task from "./pages/Task";

// CSS imports for all pages
import "./styles/Course.css";
import "./styles/Dashboard.css";
import "./styles/Login.css";
import "./styles/Profile.css";
import "./styles/Register.css";
import "./styles/Task.css";



// Optional: If we plan to use the Navbar globally later
// import Navbar from "./components/Navbar";

// If we ever want to test auth stuff again, we still got these
import { registerUser, loginUser } from "./api/auth";

// Main app routes go through here
function App() {
  return (
    <Router>
      <div style={{ padding: "2rem" }}>
        <h1>CourseWork Lite</h1>
        {/* We'll add <Navbar /> here eventually if needed */}
        <Routes>
          {/* Routing everything based on the path */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/task" element={<Task />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;