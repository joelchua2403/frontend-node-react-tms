import React from 'react';
import { useDrag } from 'react-dnd';

const DraggablePost = ({ post, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'POST',
    item: { id: post.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '16px',
        margin: '0 0 8px 0',
        backgroundColor: '#fff',
        border: '1px solid lightgrey',
        borderRadius: '4px',
      }}
    >
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => onEdit(post)}>Edit</button>
      <button onClick={() => onDelete(post.id)}>Delete</button>
    </div>
  );
};

export default DraggablePost;
