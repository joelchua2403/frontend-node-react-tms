import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { username } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const fetchUserInfo = async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get('http://localhost:3001/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    try {
      await axios.put('http://localhost:3001/users/update-email', { newEmail }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Email updated successfully');
      setNewEmail('');
      fetchUserInfo();
    } catch (error) {
      console.error('Failed to update email:', error);
      alert('Failed to update email');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    try {
      await axios.put('http://localhost:3001/users/update-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setMessage('');
    } catch (error) {
      console.error('Failed to update password:', error);
      setMessage(error.response.data.error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>Profile Page</h2>
      
      <h3>User Information</h3>
      <p>Username: {userInfo.username}</p>
      <p>Email: {userInfo.email}</p>

      <form onSubmit={handleEmailChange} style={{ marginBottom: '20px' }}>
        <label>New Email:</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Update Email</button>
      </form>

      <form onSubmit={handlePasswordChange} style={{ marginBottom: '20px' }}>
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Update Password</button>
      </form>
      {message && <h3>{message}</h3>}
    </div>
  );
};

export default ProfilePage;
