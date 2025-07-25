import React from 'react';

const TaskList = ({ tasks, selectedCourseID}) => {
    if (!selectedCourseID){
        return <p>Select a course to view its tasks.</p>;
}

const filteredTasks = tasks.filter(task => task.courseID === selectedCourseID);

if (filteredTasks.length === 0) {
    return <p>No tasks for this course.</p>;
}

return ( 
    <div>
        <h2>Tasks</h2>
        <ul>
            {filteredTasks.map(task => (
            <li key={task.id} style={{marginBottom: '1rem'}}>
                <strong>{task.title}</strong> <br/>
                Due: {new Date(task.dueDate).toLocaleDateString()} <br />
                Priority: {task.priority} <br/>
                Status: {task.status}
            </li>
            ))}
        </ul>
    </div>
);
};

export default TaskList;