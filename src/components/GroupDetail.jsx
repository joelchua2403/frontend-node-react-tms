import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Posts from './Posts';
import Cookies from 'js-cookie';

const GroupDetail = () => {
  const { groupId } = useParams();
  const { userId } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({ id: '', title: '', content: '', status: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postStatus, setPostStatus] = useState('scheduled'); // Default to 'scheduled'
  const [isAuthenticated, setIsAuthenticated] = useState(true); // This should be set based on your auth logic

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

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    const post = {
      title: postTitle,
      content: postContent,
      status: postStatus,
      userId,
      groupId
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
    } catch (error) {
      console.error('Error creating post', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPost({ ...editPost, [name]: value });
  };

  const onEdit = (post) => {
    setIsEditing(true);
    setEditPost(post);
  };

  const onEditSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    try {
      const response = await axios.put(`http://localhost:3001/posts/${editPost.id}`, editPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.map(post => post.id === editPost.id ? response.data : post));
      setIsEditing(false);
      setEditPost({ id: '', title: '', content: '', status: '' });
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

  return (
    <div>
      {group && (
        <>
          <h2>{group.name}</h2>
          <form onSubmit={handlePostSubmit}>
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
            <label>Status:</label>
            <select
              name="status"
              value={postStatus}
              onChange={(e) => setPostStatus(e.target.value)}
            >
              <option value="scheduled">Scheduled</option>
              <option value="in development">In Development</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit">Post</button>
          </form>
          {isSubmitted && (
            <div>
              <h3>Post Submitted!</h3>
            </div>
          )}
          <div className="posts-container">
            <div className="posts-column">
              <h3>Scheduled</h3>
              <Posts
                isEditing={isEditing}
                isAuthenticated={isAuthenticated}
                editPost={editPost}
                handleEditChange={handleEditChange}
                onEditSubmit={onEditSubmit}
                onDelete={onDelete}
                onEdit={onEdit}
                posts={posts.filter(post => post.status === 'scheduled')}
              />
            </div>
            <div className="posts-column">
              <h3>In Development</h3>
              <Posts
                isEditing={isEditing}
                isAuthenticated={isAuthenticated}
                editPost={editPost}
                handleEditChange={handleEditChange}
                onEditSubmit={onEditSubmit}
                onDelete={onDelete}
                onEdit={onEdit}
                posts={posts.filter(post => post.status === 'in development')}
              />
            </div>
            <div className="posts-column">
              <h3>Completed</h3>
              <Posts
                isEditing={isEditing}
                isAuthenticated={isAuthenticated}
                editPost={editPost}
                handleEditChange={handleEditChange}
                onEditSubmit={onEditSubmit}
                onDelete={onDelete}
                onEdit={onEdit}
                posts={posts.filter(post => post.status === 'completed')}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GroupDetail;
