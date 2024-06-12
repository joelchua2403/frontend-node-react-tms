import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import Cookies from 'js-cookie'

const AdminPage = () => {
    const { userRole } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
  // console.log('userRole', userRole);


    useEffect(() => {
        fetchUsers();
    }, []);

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
        
        </>    
    )}
    
    
    </div>
  )
}

export default AdminPage