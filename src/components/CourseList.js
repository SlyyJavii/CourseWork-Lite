import { useEffect, useState } from 'react';

function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
  fetch('https://coursework-lite.onrender.com/courses')
    .then((res) => res.json())
    .then((data) => {
      console.log('Courses from API:', data); // <- Add this
      setCourses(data);
    })
    .catch((err) => console.error('Error fetching courses:', err));
}, []);


  return (
    <div>
      <h2>Your Courses</h2>
      {courses.length === 0 ? (
      <p>Loading or no courses available...</p>
    ) : (
      <ul>
        {courses.map((course) => (
          <li key={course._id}>{course.courseName}</li>
        ))}
      </ul>
    )}
  </div>
);
}

export default CourseList;
