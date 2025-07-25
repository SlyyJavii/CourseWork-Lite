import React, { useEffect, useState } from 'react';
import CreateCourseForm from './CreateCourseForm';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view courses.');
        return;
      }

      try {
        const res = await fetch('https://coursework-lite.onrender.com/courses', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCourses(Array.isArray(data) ? data : data.courses || []);
          setError(null);
        } else if (res.status === 401) {
          setError('Not authenticated. Please log in again.');
        } else {
          setError('Failed to load courses.');
        }
      } catch (err) {
        setError('Network error. Please try again later.');
      }
    };

    fetchCourses();
  }, []);

  const handleCourseCreated = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  return (
    <div>
      <CreateCourseForm onCourseCreated={handleCourseCreated} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {courses.length === 0 && !error ? (
        <p>No courses found.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <strong>{course.courseName}</strong> ({course.courseCode}) - {course.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseList;
