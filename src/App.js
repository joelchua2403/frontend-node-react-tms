import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import { GroupProvider } from './context/GroupContext';
import ProfilePage from './pages/ProfilePage';
import ApplicationPage from './pages/ApplicationPage';
import DisabledAccountPage from './pages/DisabledAccountPage';
import setupInterceptors from './axiosConfig';

// Protected Route for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }
  return children;
};

// Protected Route for admin users
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/' />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

const MainApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return (
    <div>
      <div className='App'>
        <AuthProvider>
          <GroupProvider>
            <Navbar />
            <Routes>
              <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/application/:app_acronym' element={<ProtectedRoute><ApplicationPage /></ProtectedRoute>} />
              <Route path='/admin' element={<ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>} />
              <Route path='/disabled-account' element={<DisabledAccountPage />} />
            </Routes>
          </GroupProvider>
        </AuthProvider>
      </div>
    </div>
  );
};

export default App;
