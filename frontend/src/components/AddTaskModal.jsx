import React, { useState } from 'react';
import apiClient from '../api/axios';
import '../styles/CreationForms.css';

const AddTaskModal = ({ courses,selectedCourseId, onClose, onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState(
        selectedCourseId !== 'all' && selectedCourseId ? selectedCourseId : (courses.length > 0 ? courses[0].id : '')
    );
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Low');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!courseId) {
            setError('Please select a course.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            const payload = { 
                title, 
                courseId,
                priority,
                description
            };
            if (dueDate){
                payload.dueDate = new Date(dueDate).toISOString(); // Convert to ISO string
            };
            const response = await apiClient.post('/tasks/', payload);
            onTaskAdded(response.data);
            onClose();
        } catch (err) {
            setError('Failed to create task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Task</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="creation-form">
                    <div className="form-group">
                        <label htmlFor="title">Task Title</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description (Optional)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows="3"
                        ></textarea>
                        <label htmlFor="courseId">Course</label>
                        <select id="courseId" value={courseId} onChange={e => setCourseId(e.target.value)} required>
                            {courses.length === 0 ? (
                                <option disabled>Please create a course first</option>
                            ) : (
                                courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.courseName}</option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date (Optional)</label>
                        <input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select id="priority" value={priority} onChange={e => setPriority(e.target.value)}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="button-cancel">Cancel</button>
                        <button type="submit" className="button-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;