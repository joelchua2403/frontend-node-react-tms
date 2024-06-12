import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import '../App.css';


const Navbar = () => {
  const { isAuthenticated, handleLogout } = useContext(AuthContext);
const navigate = useNavigate();
const { userRole } = useContext(AuthContext);

const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');  
}

  return (
    <nav>
      {isAuthenticated && (
        <>
        <Link className='link-button' to="/profile">Profile</Link>
        <Link className='link-button' to="/">Home</Link>
        <Link className='link-button' to="/createpost">Create a Post</Link>
        {userRole === 'admin' && (
            <Link className='link-button' to="/admin">Admin</Link>
          )}
        </>)}
        {isAuthenticated ? (
            <button className='link-button' onClick={handleLogoutClick}>Logout</button>
        ) : (
            <Link className='link-button' to="/login">Login</Link>
        )}
        <Link className='link-button' to="/register">Register</Link>
    </nav>
  )
}

export default Navbar