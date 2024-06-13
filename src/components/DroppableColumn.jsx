import React from 'react';
import { useDrop } from 'react-dnd';

const DroppableColumn = ({ status, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'POST',
    drop: (item) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        padding: '16px',
        width: '30%',
        minHeight: '400px',
        margin: '0 8px',
        backgroundColor: isOver ? 'lightgrey' : 'white',
        border: '1px solid lightgrey',
        borderRadius: '4px',
      }}
    >
      <h2>{status}</h2>
      {children}
    </div>
  );
};

export default DroppableColumn;
