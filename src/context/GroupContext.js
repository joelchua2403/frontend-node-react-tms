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
      // Log the token to ensure it is being retrieved correctly
      console.log('Token:', token);
  
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
  
      // Log the responses to see if they are returned correctly
      console.log('Group Response:', groupResponse);
      console.log('User Group Response:', userGroupResponse);
  
      setGroups(groupResponse.data);
      const userGroupIds = userGroupResponse.data.map(ug => ug.groupId);
      console.log('Initial userGroupIds', userGroupIds);
      setUserGroupsIds(userGroupIds);
    } catch (error) {
      // Log the error details to understand what went wrong
      console.error('Error fetching groups or user groups:', error);
  
      // Log the specific responses if available
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
      }
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
