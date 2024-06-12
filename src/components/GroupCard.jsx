import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GroupContext } from '../context/GroupContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const GroupCard = () => {
  const [groupname, setGroupname] = useState('');
  const { userId } = useContext(AuthContext);
  const { groups, setGroups, userGroupsIds, setUserGroupsIds } = useContext(GroupContext);

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

  const joinGroup = async (groupId) => {
    const token = Cookies.get('token');

    try {
      await axios.post(`http://localhost:3001/usergroups/${groupId}/join`, { userId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('You have joined the group');
      setUserGroupsIds([...userGroupsIds, groupId]);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (groupId) => {
    const token = Cookies.get('token');

    try {
      await axios.post(`http://localhost:3001/usergroups/${groupId}/leave`, { userId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('You have left the group');
      setUserGroupsIds(userGroupsIds.filter(id => id !== groupId));
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <div>
      <div>
        <h2>Create a Group</h2>
        <form onSubmit={onSubmit}>
          <label>Group Name:</label>
          <input type="text" name="groupname" value={groupname} onChange={onChange} />
          <button type="submit">Create Group</button>
        </form>
      </div>

      <div>
        <h2>Groups</h2>
        {groups && groups.map(group => (
          <div key={group.id}>
            <h3>{group.name}</h3>
            {userGroupsIds.includes(group.id) ? (
              <button onClick={() => leaveGroup(group.id)}>Leave Group</button>
            ) : (
              <button onClick={() => joinGroup(group.id)}>Join Group</button>
            )}
          </div>
        ))}
      </div>

      <div>
        <h3>My Groups</h3>
        {groups && groups.filter(group => userGroupsIds.includes(group.id)).map(group => (
          <div key={group.id}>
            <Link to={`/groups/${group.id}`}><h3>{group.name}</h3></Link>
            <button onClick={() => leaveGroup(group.id)}>Leave Group</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupCard;

