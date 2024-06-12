import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userGroupsIds, setUserGroupsIds] = useState([]);

  const fetchGroupsAndUserGroups = async () => {
    const token = Cookies.get('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      const [groupResponse, userGroupResponse] = await Promise.all([
        axios.get('http://localhost:3001/groups', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get('http://localhost:3001/usergroups', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      setGroups(groupResponse.data);
      const userGroupIds = userGroupResponse.data.map(ug => ug.groupId);
      console.log('Initial userGroupIds', userGroupIds);
      setUserGroupsIds(userGroupIds);
    } catch (error) {
      console.error('Error fetching groups or user groups', error);
    }
  };

  useEffect(() => {
    fetchGroupsAndUserGroups();
  }, []);
  return (
    <GroupContext.Provider value={{ groups, setGroups, selectedGroup, setSelectedGroup, userGroupsIds, setUserGroupsIds, fetchGroupsAndUserGroups }}>
      {children}
    </GroupContext.Provider>
  );
};
