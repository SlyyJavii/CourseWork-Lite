import React from 'react';

const Sidebar = ({ courses, selectedCourseId, onSelectCourse }) => {
    return (
        <aside className="sidebar">
            <nav>
                <h2 className="sidebar-title">Courses</h2>
                <ul>
                    {/* "All Tasks" filter option */}
                    <li
                        className={selectedCourseId === 'all' ? 'active' : ''}
                        onClick={() => onSelectCourse('all')}
                    >
                        All Tasks
                    </li>
                    {/* List of courses from the API */}
                    {courses.map(course => (
                        <li
                            key={course.id}
                            className={selectedCourseId === course.id ? 'active' : ''}
                            onClick={() => onSelectCourse(course.id)}
                        >
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