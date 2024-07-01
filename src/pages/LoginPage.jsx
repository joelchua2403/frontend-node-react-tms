import React from 'react'
import { useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { GroupContext } from '../context/GroupContext';
import { useContext } from 'react';


const LoginPage = () => {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const { handleLogin } = useContext(AuthContext);
const { fetchGroupsAndUserGroups } = useContext(GroupContext);
const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(username, password);
      await fetchGroupsAndUserGroups()
      setMessage('Login successful');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Invalid username or password'); }
        else if (error.response && error.response.status === 540) {
          setMessage('Your account has been disabled');
        }
       else {
        setMessage('Login failed');
      }
    }
  };



  return (
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  <div style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
    <h2 style={{ textAlign: 'center' }}>Login</h2>
    <form onSubmit={onSubmit}>
      <label>Username:</label>
      <input
        type="text"
        name='username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          margin: '8px 0',
          display: 'block',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
          fontSize: '16px',
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        name='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          margin: '8px 0',
          display: 'block',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
          fontSize: '16px',
        }}
      />
      <button type="submit" style={{
        width: '100%',
        padding: '10px',
        margin: '8px 0',
        display: 'block',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
      }}>
        Login
      </button>
    </form>
    {message && <h3 style={{ textAlign: 'center' }}>{message}</h3>}
  </div>
</div>


  )
}

export default LoginPage