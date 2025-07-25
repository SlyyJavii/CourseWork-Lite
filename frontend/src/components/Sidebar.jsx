import React from 'react';

const Sidebar = ({ courses, selectedCourseId, onSelectCourse, onAddCourse, onEditCourse, onDeleteCourse, showArchived, onToggleArchived }) => {
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
          <li
            className={`course-list-item ${selectedCourseId === 'all' ? 'active' : ''}`}
            onClick={() => onSelectCourse('all')}
          >
            <div className="course-info">
              <span className="course-color-tag all-tasks-icon"></span>
              <span className="course-name-text">All Tasks</span>
            </div>
                    </li>
                    {courses.map(course => (
                        <li
                            key={course.id}
                            className={`course-list-item ${selectedCourseId === course.id ? 'active' : ''}`}
                            onClick={() => onSelectCourse(course.id)}
                        >
                            <div className="course-info">
                                <span className="course-color-tag" style={{ backgroundColor: course.colorTag || '#ccc' }}></span>
                                <span className="course-name-text" title={course.courseName}>{course.courseName}</span>
                            </div>
                            <div className="course-actions">
                                <button onClick={(e) => { e.stopPropagation(); onEditCourse(course); }} className="action-button edit-button" title="Edit Course">✏️</button>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }} className="action-button delete-button" title="Delete Course">🗑️</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>
      <div className="sidebar-footer">
        <label className="archive-toggle">
          <input 
            type="checkbox"
            checked={showArchived}
            onChange={onToggleArchived}
          />
          <span className="slider"></span>
          <span className="toggle-label">Show Archived</span>
        </label>
      </div>
        </aside>
    );
};
export default Sidebar;