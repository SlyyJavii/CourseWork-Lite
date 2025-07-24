import React, { useEffect, useState } from 'react';
import "../styles/Course.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // hit the backend to grab all courses
    fetch('https://coursework-lite.onrender.com/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error('Error fetching courses:', err));
  }, []);

  return (
    <div className="courses-container">
      <h2>All Courses</h2>
      {courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : (
        <ul className="courses-list">
          {courses.map((course) => (
            <li key={course.id} className="course-item">
              <h3>{course.name}</h3>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Courses;
