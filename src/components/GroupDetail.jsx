import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const GroupDetail = () => {
  const { groupId } = useParams();
  const { userId } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({ id: '', title: '', content: '' });
  const [showAddPost, setShowAddPost] = useState({ scheduled: false, 'in development': false, completed: false });

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`http://localhost:3001/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`http://localhost:3001/groups/${groupId}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };

    fetchGroup();
    fetchPosts();
  }, [groupId]);

  const handlePostSubmit = async (e, status) => {
    e.preventDefault();
    const token = Cookies.get('token');
    const post = {
      title: postTitle,
      content: postContent,
      userId,
      groupId,
      status: status
    };

    try {
      const response = await axios.post(`http://localhost:3001/posts`, post, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts([...posts, response.data]);
      setPostTitle('');
      setPostContent('');
      setIsSubmitted(true);
      setShowAddPost({ ...showAddPost, [status]: false });
    } catch (error) {
      console.error('Error creating post', error);
    }
  };

  const handleDrop = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const postId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    const token = Cookies.get('token');
    try {
      await axios.put(`http://localhost:3001/posts/${postId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.map(post => post.id === postId ? { ...post, status: newStatus } : post));
    } catch (error) {
      console.error('Error updating post status', error);
    }
  };

  const onEdit = (post) => {
    setIsEditing(true);
    setEditPost(post);
  };

  const onEditSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    try {
      await axios.put(`http://localhost:3001/posts/${editPost.id}`, editPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.map(post => post.id === editPost.id ? { ...editPost, status: post.status } : post));
      setIsEditing(false);
      setEditPost({ id: '', title: '', content: '' });
    } catch (error) {
      console.error('Error editing post', error);
    }
  };

  const onDelete = async (id) => {
    const token = Cookies.get('token');
    try {
      await axios.delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  const columns = {
    scheduled: { title: 'Scheduled', items: posts.filter(post => post.status === 'scheduled') },
    'in development': { title: 'In Development', items: posts.filter(post => post.status === 'in development') },
    completed: { title: 'Completed', items: posts.filter(post => post.status === 'completed') }
  };

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <div>
        {group && (
          <>
            <h2>{group.name}</h2>
            {isSubmitted && (
              <div>
                <h3>Post Submitted!</h3>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {Object.entries(columns).map(([status, column]) => (
                <Droppable key={status} droppableId={status}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        margin: '8px',
                        border: '1px solid lightgrey',
                        borderRadius: '4px',
                        padding: '8px',
                        width: '300px',
                        minHeight: '400px'
                      }}
                    >
                      <h3>{column.title}</h3>
                      {column.items.map((post, index) => (
                        <Draggable key={post.id} draggableId={post.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                padding: '16px',
                                margin: '0 0 8px 0',
                                minHeight: '50px',
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                border: '1px solid lightgrey',
                                ...provided.draggableProps.style
                              }}
                            >
                              {isEditing && editPost.id === post.id ? (
                                <form onSubmit={onEditSubmit}>
                                  <input
                                    type="text"
                                    name="title"
                                    value={editPost.title}
                                    onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                                  />
                                  <textarea
                                    name="content"
                                    value={editPost.content}
                                    onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                                  />
                                  <button type="submit">Save</button>
                                  <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                </form>
                              ) : (
                                <>
                                  <h4>{post.title}</h4>
                                  <p>{post.content}</p>
                                  <button onClick={() => onEdit(post)}>Edit</button>
                                  <button onClick={() => onDelete(post.id)}>Delete</button>
                                </>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {showAddPost[status] ? (
                        <form onSubmit={(e) => handlePostSubmit(e, status)}>
                          <label>Title:</label>
                          <input
                            type="text"
                            name="title"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="Title"
                          />
                          <label>Content:</label>
                          <textarea
                            name="content"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="Write your post here"
                          />
                          <button type="submit">Post</button>
                          <button type="button" onClick={() => setShowAddPost({ ...showAddPost, [status]: false })}>Cancel</button>
                        </form>
                      ) : (
                        <button onClick={() => setShowAddPost({ ...showAddPost, [status]: true })}>Add Post</button>
                      )}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </>
        )}
      </div>
    </DragDropContext>
  );
};

export default GroupDetail;
