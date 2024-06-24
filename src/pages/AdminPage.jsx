import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GroupContext } from '../context/GroupContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import Select from 'react-select';
import Styles from '../styles/AdminPage.css';

const AdminPage = () => {
  const { isAdmin } = useContext(AuthContext);
  const { groups, setGroups} = useContext(GroupContext);
  const [groupname, setGroupname] = useState('');
  const [users, setUsers] = useState([]);
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

  const handleEnableUser = async (username) => {
    const token = Cookies.get('token');
    await axios.patch(
      `http://localhost:3001/users/${username}/enable`,
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
    setEditedUser({ ...user, password: '', groups: user.groups || [] });
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

  const onSubmit = async (e) => {
    e.preventDefault();
    const group = { name: groupname };
    const token = Cookies.get('token');

    try {
      const response = await axios.post('http://localhost:3001/groups', group, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroups([...groups, response.data]);
      setGroupname('');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const onChange = (e) => {
    setGroupname(e.target.value);
  };


  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <div>
        <h2>Create a Group</h2>
        <form onSubmit={onSubmit}>
          <label>Group Name:</label>
          <input style={{ width: '50%' }} type="text" name="groupname" value={groupname} onChange={onChange} />
          <button type="submit">Create Group</button>
        </form>
      </div>
      {!isAdmin && <h2>Access denied</h2>}
      {isAdmin && (
        <>
          <h2>Users</h2>
         
          <div className='admin-table-container'>
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
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {editMode === user.username ? (
                          <button onClick={handleSaveUser}>Save</button>
                        ) : (
                          <button onClick={() => handleEditUser(user.username)}>Edit</button>
                        )}
                        {user.username !== 'admin' && (
                          user.isDisabled ? (
                            <button onClick={() => handleEnableUser(user.username)}>
                              Enable
                            </button>
                          ) : (
                            <button onClick={() => handleDisableUser(user.username)}>
                              Disable
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {message && <h3>{message}</h3>}
        </>
      )}
    </div>
  );
};

export default AdminPage;
