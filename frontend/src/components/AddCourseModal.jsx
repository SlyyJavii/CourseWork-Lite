import React, { useState } from 'react';
import apiClient from '../api/axios';
import '../styles/CreationForms.css';

// --- NEW: Helper function to convert HSL to a Hex string ---
const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

// Function to generate random color tags
const generateRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70;
    const lightness = 85;
    return hslToHex(hue,saturation,lightness);
};

const AddCourseModal = ({ onClose, onCourseAdded }) => {
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [colorTag, setColorTag] = useState(generateRandomPastelColor);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/courses/', {
                courseName,
                courseCode,
                colorTag,
            });
            onCourseAdded(response.data); // Pass the new course back to the Dashboard
            onClose(); // Close the modal
        } catch (err) {
            setError('Failed to create course. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Course</h2>
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
                            {isSubmitting ? 'Adding...' : 'Add Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourseModal;