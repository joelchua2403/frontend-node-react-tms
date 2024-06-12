import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const navigate = useNavigate();
const { handleLogin } = useContext(AuthContext);
const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(username, password);
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
    <div>
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
            <label>Username:</label>
            <input type="text" name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Password:</label>
            <input type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
        {message && <h3>{message}</h3>}
        <Link to="/forgot-password">Forgot Password?</Link>
    </div>

  )
}

export default LoginPage