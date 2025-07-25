import React from 'react';

const Reminders = ({ tasks }) => {
    const { overdue, dueSoon } = tasks;

    if (overdue.length === 0 && dueSoon.length === 0) {
        return null;
    }

    return (
        <div className="reminders-container">
            {overdue.length > 0 && (
                <div className="reminder-section overdue">
                    <h4 className="reminder-title">Past Due</h4>
                    <ul>
                        {overdue.map(task => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                </div>
            )}
            {dueSoon.length > 0 && (
                <div className="reminder-section due-soon">
                    <h4 className="reminder-title">Due Soon (24 Hours)</h4>
                    <ul>
                        {dueSoon.map(task => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Reminders;