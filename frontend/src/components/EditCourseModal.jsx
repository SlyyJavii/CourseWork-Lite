import React, { useState } from 'react';
import apiClient from '../api/axios';
import '../styles/CreationForms.css';

const EditCourseModal = ({ course, onClose, onCourseUpdated }) => {
    const [courseName, setCourseName] = useState(course.courseName);
    const [courseCode, setCourseCode] = useState(course.courseCode || '');
    const [colorTag, setColorTag] = useState(course.colorTag || '#4A90E2');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const response = await apiClient.put(`/courses/${course.id}`, {
                courseName,
                courseCode,
                colorTag,
            });
            onCourseUpdated(response.data); // Pass the updated course back to the Dashboard
            onClose(); // Close the modal
        } catch (err) {
            setError('Failed to update course. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Course</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="creation-form">
                    <div className="form-group">
                        <label htmlFor="courseName">Course Name</label>
                        <input id="courseName" type="text" value={courseName} onChange={e => setCourseName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="courseCode">Course Code (Optional)</label>
                        <input id="courseCode" type="text" value={courseCode} onChange={e => setCourseCode(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="colorTag">Color Tag</label>
                        <input id="colorTag" type="color" value={colorTag} onChange={e => setColorTag(e.target.value)} />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="button-cancel">Cancel</button>
                        <button type="submit" className="button-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCourseModal;