import React from 'react';

const TaskCard = ({ task, onOpenTask }) => {
  return (
    <div className="task-card">
      <p>Name: {task.Task_name}</p>
      <p>Description: {task.Task_description}</p>
      <p>Plan: {task.Task_plan}</p>
      <p>Owner: {task.Task_owner}</p>
      <button className="right-arrow-btn" onClick={() => onOpenTask(task)}>→</button>
    </div>
  );
};

export default TaskCard;
