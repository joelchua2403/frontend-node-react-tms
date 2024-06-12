import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/users/login', { username, password }, {withCredentials: true});
      if (response.status === 200) {
        const token = Cookies.get('token');

        if (token) {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        const id = decodedToken.id;
        setIsAuthenticated(true);
        setUserRole(role);
        setUserId(id);   
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

  const handleLogout = () => {
   Cookies.remove('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      const id = decodedToken.id;
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    console.log('userRole changed:', userRole);
  }, [userRole]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
