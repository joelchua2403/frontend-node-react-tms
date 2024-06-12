
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
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
import GroupDetail from './components/GroupDetail';
import ProfilePage from './pages/ProfilePage';



const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, userRole} = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
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
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/' element={<Home />} />
        <Route path='/createpost' element={<CreatePost/>} />
        <Route path='/login' element={<LoginPage  />} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route
          path='/admin'
          element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>}
        />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
      </Routes>
      </GroupProvider>
    </AuthProvider>
    </Router>
  </div>
</div>

)


}

export default App;
