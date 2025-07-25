import React from 'react';

const Sidebar = ({ courses, selectedCourseId, onSelectCourse, onAddCourse }) => {
    return (
        <aside className="sidebar">
            <nav>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Courses</h2>
                    <button onClick={onAddCourse} className="add-button" title="Add New Course">
                        +
                    </button>
                </div>
                <ul>
                    <li className={selectedCourseId === 'all' ? 'active' : ''} onClick={() => onSelectCourse('all')}>
                        All Tasks
                    </li>
                    {courses.map(course => (
                        <li key={course.id} className={selectedCourseId === course.id ? 'active' : ''} onClick={() => onSelectCourse(course.id)}>
                            <span className="course-color-tag" style={{ backgroundColor: course.colorTag || '#ccc' }}></span>
                            {course.courseName}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;