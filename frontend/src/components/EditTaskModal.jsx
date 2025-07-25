import React, { useState } from 'react';
import apiClient from '../api/axios';
import '../styles/CreationForms.css';

const EditTaskModal = ({ task, courses, onClose, onTaskUpdated }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.status);
    const [courseId, setCourseId] = useState(task.courseId);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const payload = { title, description, dueDate: dueDate ? new Date(dueDate).toISOString() : null, priority, status, courseId };
            const response = await apiClient.put(`/tasks/${task.id}`, payload);
            onTaskUpdated(response.data);
            onClose();
        } catch (err) {
            setError('Failed to update task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Task</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="creation-form">
                    <div className="form-group">
                        <label htmlFor="title">Task Title</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="3"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
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
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="active">Active</option>
                            <option value="complete">Complete</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="courseId">Course</label>
                        <select id="courseId" value={courseId} onChange={e => setCourseId(e.target.value)} required>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.courseName}</option>
                            ))}
                        </select>
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

export default EditTaskModal;