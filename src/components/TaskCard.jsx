import React from 'react';

const TaskCard = ({ task, onOpenTask }) => {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    margin: '10px 0',
    height: '130px', // Adjust the height as needed
    overflow: 'hidden',
    fontSize: '12px',
    position: 'relative', // Ensure the button can be positioned relative to the card
  };

  const buttonStyle = {
    position: 'absolute',
    bottom: '10px', // Adjust as needed
    right: '10px', // Adjust as needed
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#007bff',
  };

  const textContainerStyle = {
    marginBottom: '25px', // Add space for the button
  };

  const headerStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '3px',
  };

  const truncatedDescription = task.Task_description.length > 40 ? `${task.Task_description.slice(0, 40)}...` : task.Task_description;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>{task.Task_plan}</div>
      <div style={textContainerStyle}>
        <p>Name: {task.Task_name}</p>
        <p>Description: {truncatedDescription}</p>
        <p>Owner: {task.Task_owner}</p>
      </div>
      <button style={buttonStyle} onClick={() => onOpenTask(task)}>→</button>
    </div>
  );
};

export default TaskCard;
