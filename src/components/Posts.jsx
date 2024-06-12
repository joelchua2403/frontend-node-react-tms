import React from 'react';
import '../App.css';

const Posts = ({ isEditing, isAuthenticated, editPost, handleEditChange, onEditSubmit, onDelete, onEdit, posts }) => {
  return (
    <div className="posts-grid">
      {isAuthenticated ? (
        <div>
          {isEditing ? (
            <div>
              <form onSubmit={onEditSubmit}>
                <input type="text" name="title" value={editPost.title} onChange={handleEditChange} />
                <input type="text" name="content" value={editPost.content} onChange={handleEditChange} />
                <button type="submit">Submit</button>
              </form>
            </div>
          ) : (
            posts.map(post => (
              <div className="post" key={post.id}>
                <div className="title"> {post.title} </div>
                <div className="content"> {post.content} </div>
                <button onClick={() => onDelete(post.id)}> Delete </button>
                <button onClick={() => onEdit(post)}> Edit </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <p> You are not authenticated </p>
      )}
    </div>
  );
};

export default Posts;
