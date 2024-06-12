import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GroupContext } from '../context/GroupContext';
import { useContext } from 'react';
import '../App.css';

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useContext(AuthContext);
  const { setUserGroupsIds } = useContext(GroupContext);

  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);

  const handleLogoutClick = () => {
    handleLogout();
    setUserGroupsIds([]);
    navigate('/login');  
  };

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-left'>
          {isAuthenticated && (
            <>
              <Link className='link-button' to="/profile">Profile</Link>
              <Link className='link-button' to="/">Home</Link>
              <Link className='link-button' to="/createpost">Create a Post</Link>
              {userRole === 'admin' && (
                <Link className='link-button' to="/admin">Admin</Link>
              )}
            </>
          )}
        </div>
        <div className='navbar-right'>
          {isAuthenticated ? (
            <button className='link-button' onClick={handleLogoutClick}>Logout</button>
          ) : (
            <>
              <Link className='link-button' to="/login">Login</Link>
              <Link className='link-button' to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
