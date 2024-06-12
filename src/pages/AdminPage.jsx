import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import Cookies from 'js-cookie'

const AdminPage = () => {
    const { userRole } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: '' });
    const [message, setMessage] = useState('');
  // console.log('userRole', userRole);


    useEffect(() => {
        fetchUsers();
    }, []);

    const validatePassword = (password) => {
      const minLength = 8;
      const maxLength = 10;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      return (
        password.length >= minLength &&
        password.length <= maxLength &&
        hasLetter &&
        hasNumber &&
        hasSpecialChar
      );
    };

    const fetchUsers = async () => {
      const token = Cookies.get('token');
        const response = await axios.get('http://localhost:3001/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    }

    const handleDisableUser = async (id) => {
      const token = Cookies.get('token');
        await axios.patch(
          `http://localhost:3001/users/${id}/disable`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        fetchUsers();
      };

      const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!validatePassword(newUser.password)) {
          setMessage('Password does not meet requirements. It must be 8-10 characters long and contain at least one letter, one number, and one special character.');
          return;
      }
        const token = Cookies.get('token');
        try {
          const response = await axios.post('http://localhost:3001/users/register', newUser, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setNewUser({ username: '', email: '', password: '', role: '' });
          console.log('User created:', response.data);
          fetchUsers();
          setShowCreateForm(false);
          alert('User created successfully');
        } catch (error) {
          console.error('Error creating user:', error);
          setMessage(error.response.data.error)
        }
      }

        const handleInputChange = (e) => {
          const { name, value } = e.target;
          setNewUser({ ...newUser, [name]: value });
        };
        

  return (
    <div>
    <h1>Admin Page</h1>
    {userRole !== 'admin' && <h2>Access denied</h2>}
    {userRole === 'admin' && (
        <>
           <h2>Users</h2>
       
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.username} ({user.email}) - {user.role}
                {user.isDisabled ? ' - Disabled' : 
                <button onClick={() => handleDisableUser(user.id)}>Disable</button>
}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowCreateForm(true)}>Create User</button>
          {showCreateForm && (
            <>
            <form onSubmit={handleCreateUser}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
              />
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
              />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
              />
              <label>Role:</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Create</button>
            </form>
            {message && <h3>{message}</h3>}
            </>

          )  
          }

        
        </>    
    )}
    
    
    </div>
  )
}

export default AdminPage