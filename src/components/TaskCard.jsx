import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <p>Name: {task.Task_name}</p>
      <p>Description: {task.Task_description}</p>
      <p>Plan: {task.Task_plan}</p>
      <p>Owner: {task.Task_owner}</p>
    </div>
  );
};

export default TaskCard;
