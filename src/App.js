
import Home from './pages/Home';

import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import { Navigate } from 'react-router-dom';
import { GroupProvider } from './context/GroupContext';
import ProfilePage from './pages/ProfilePage';
import ApplicationPage from './pages/ApplicationPage';



const ProtectedRoute = ({ children }) => {
  const { isAuthenticated} = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }
  return children;
}


const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin} = useContext(AuthContext);
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/' />;
  }
  return children;
}
function App() {


return (
 
<div>
  <div className='App'>
    <Router>
    <AuthProvider>
      <GroupProvider>
    <Navbar  />
      <Routes>
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/login' element={<LoginPage  />} />
        <Route path='/application/:app_acronym' element={<ProtectedRoute><ApplicationPage /></ProtectedRoute>} />
        <Route
          path='/admin'
          element={<ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>}
        />
    
      </Routes>
      </GroupProvider>
    </AuthProvider>
    </Router>
  </div>
</div>

)


}

export default App;
