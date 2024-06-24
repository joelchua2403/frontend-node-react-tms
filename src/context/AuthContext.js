import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [userGroups, setUserGroups] = useState([]);
  const [userId, setUserId] = useState(Cookies.get('userId'));
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [isInGroupProjectLead, setIsInGroupProjectLead] = useState(false);
  const [isInGroupProjectManager, setIsInGroupProjectManager] = useState(false);
  const [isInGroupDeveloper, setIsInGroupDeveloper] = useState(false);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/users/login', { username, password }, { withCredentials: true });
      if (response.status === 200) {
        const token = Cookies.get('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setIsAuthenticated(true);
          setUserId(decodedToken.username);
          await fetchUserGroups(decodedToken.username);
          navigate('/');
        } else {
          throw new Error('Token not found in cookies');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const fetchUserGroups = async (username) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get('http://localhost:3001/usergroups', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const users = response.data;
      const currentUser = users.find(user => user.username === username);
      if (currentUser) {
        setUserGroups(currentUser.groups);
        setIsAdmin(currentUser.groups.includes('admin'));
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUserGroups([]);
    setUserId(null);
    setIsAdmin(false);
    navigate('/login');
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAuthenticated(true);
      setUserId(decodedToken.username);
      fetchUserGroups(decodedToken.username);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userGroups, userId, isAdmin, handleLogin, handleLogout, setIsInGroupDeveloper, setIsInGroupProjectLead, setIsInGroupProjectManager, isInGroupDeveloper, isInGroupProjectLead, isInGroupProjectManager }}>
      {children}
    </AuthContext.Provider>
  );
};