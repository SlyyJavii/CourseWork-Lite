import React, { useState } from 'react';

const CreateCourseForm = ({ onCourseCreated }) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [colorTag, setColorTag] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a course.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://coursework-lite.onrender.com/courses/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          courseCode,
          colorTag,
          description,
        }),
      });

      if (res.ok) {
        const newCourse = await res.json();
        setCourseName('');
        setCourseCode('');
        setColorTag('');
        setDescription('');
        onCourseCreated(newCourse);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || 'Failed to create course.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '1rem auto' }}>
      <h3>Create a New Course</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        required
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <input
        type="text"
        placeholder="Course Code"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        required
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <input
        type="text"
        placeholder="Color Tag"
        value={colorTag}
        onChange={(e) => setColorTag(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  );
};

export default CreateCourseForm;
