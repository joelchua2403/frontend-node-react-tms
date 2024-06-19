import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import Select from 'react-select';

const AdminPage = () => {
  const { userRole } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({ username: '', email: '', password: '', groups: [] });
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', groups: [] });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchUsers = async () => {
    const token = Cookies.get('token');
    const response = await axios.get('http://localhost:3001/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const usersWithGroups = response.data.map(user => ({
      ...user,
      groups: user.groups.map(group => group.name) // Map groups to their names
    }));
    setUsers(usersWithGroups);
  };

  const fetchGroups = async () => {
    const token = Cookies.get('token');
    const response = await axios.get('http://localhost:3001/groups', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGroups(response.data);
  };

  const handleDisableUser = async (username) => {
    const token = Cookies.get('token');
    await axios.patch(
      `http://localhost:3001/users/${username}/disable`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchUsers();
  };

  const handleInputChange = (e, setFunction) => {
    const { name, value } = e.target;
    setFunction(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupChange = (selectedOptions, setFunction) => {
    setFunction(prev => ({ ...prev, groups: selectedOptions.map(option => option.value) }));
  };

  const handleEditUser = (username) => {
    const user = users.find((user) => user.username === username);
    setEditedUser({ ...user, password:'', groups: user.groups || [] });
    setEditMode(username);
  };

  const handleSaveUser = async () => {
    const token = Cookies.get('token');
    try {
      await axios.put(`http://localhost:3001/users/${editedUser.username}`, editedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update user groups
      await axios.put('http://localhost:3001/users/update-groups', 
        { username: editedUser.username, groups: editedUser.groups }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditMode(null);
      fetchUsers();
      setMessage('User updated successfully');
    } catch (error) {
      setMessage('Error updating user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    try {
      const response = await axios.post('http://localhost:3001/users/register', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assign groups to new user
      await axios.put('http://localhost:3001/users/update-groups', 
        { username: newUser.username, groups: newUser.groups }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewUser({ username: '', email: '', password: '', groups: [] });
      fetchUsers();
      setShowCreateForm(false);
      setMessage('User created successfully');
    } catch (error) {
      setMessage(error.response.data.error || 'Error creating user');
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      {userRole !== 'admin' && <h2>Access denied</h2>}
      {userRole === 'admin' && (
        <>
          <h2>Users</h2>
          {!showCreateForm && (
            <button onClick={() => setShowCreateForm(true)}>Create User</button>
          )}
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>isDisabled</th>
                <th>Groups</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showCreateForm && (
                <tr>
                  <td>
                    <input
                      type="text"
                      name="username"
                      value={newUser.username}
                      onChange={(e) => handleInputChange(e, setNewUser)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="email"
                      value={newUser.email}
                      onChange={(e) => handleInputChange(e, setNewUser)}
                    />
                  </td>
                  <td>
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={(e) => handleInputChange(e, setNewUser)}
                    />
                  </td>
                  <td> - </td>
                  <td>
                    <Select
                      isMulti
                      name="groups"
                      options={groups.map(group => ({ value: group.name, label: group.name }))}
                      value={newUser.groups.map(group => ({ value: group, label: group }))}
                      onChange={(selectedOptions) => handleGroupChange(selectedOptions, setNewUser)}
                    />
                  </td>
                  <td>
                    <button onClick={handleCreateUser}>Save</button>
                    <button onClick={() => setShowCreateForm(false)}>Cancel</button>
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>
                    {editMode === user.username ? (
                      <input
                        type="text"
                        name="email"
                        value={editedUser.email}
                        onChange={(e) => handleInputChange(e, setEditedUser)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editMode === user.username ? (
                      <input
                        type="password"
                        name="password"
                        placeholder=''
                        value={editedUser.password}
                        onFocus={() => setEditedUser({ ...editedUser, password: '' })}
                        onChange={(e) => handleInputChange(e, setEditedUser)}
                      />
                    ) : (
                      '******'
                    )}
                  </td>
                  <td>{user.isDisabled ? 'Yes' : 'No'}</td>
                  <td>
                    {editMode === user.username ? (
                      <Select
                        isMulti
                        name="groups"
                        options={groups.map(group => ({ value: group.name, label: group.name }))}
                        value={editedUser.groups.map(group => ({ value: group, label: group }))}
                        onChange={(selectedOptions) => handleGroupChange(selectedOptions, setEditedUser)}
                      />
                    ) : (
                      user.groups && user.groups.join(', ')
                    )}
                  </td>
                  <td>
                    {editMode === user.username ? (
                      <button onClick={handleSaveUser}>Save</button>
                    ) : (
                      <button onClick={() => handleEditUser(user.username)}>Edit</button>
                    )}
                      {user.username !== 'admin' && (
                      <button onClick={() => handleDisableUser(user.username)}>
                        {user.isDisabled ? 'Enable' : 'Disable'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        
          {message && <h3>{message}</h3>}
        </>
      )}
    </div>
  );
};

export default AdminPage;
