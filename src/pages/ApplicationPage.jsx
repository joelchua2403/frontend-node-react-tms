import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import PlanModal from '../components/PlanModal';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/ApplicationPage.css';
import { set } from 'date-fns';
import { AuthContext } from '../context/AuthContext';

const ApplicationPage = () => {
  const { app_acronym } = useParams();
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
    const { userId, setIsInGroupProjectLead, setIsInGroupDeveloper, setIsInGroupProjectManager, isInGroupProjectLead, isInGroupProjectManager, isInGroupDeveloper } = useContext(AuthContext);


  const fetchPlans = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:3001/plans/${app_acronym}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchTasks();
    fetchUserGroups();
    setIsInGroupProjectLead(false);
    setIsInGroupProjectManager(false);
    setIsInGroupDeveloper(false);
  }, [app_acronym]);

  const fetchTasks = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:3001/tasks/${app_acronym}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUserGroups = async (username) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get('http://localhost:3001/usergroups', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const users = response.data;
      const currentUser = users.find(user => user.username === userId);
      if (currentUser) {
        setUserGroups(currentUser.groups);
        setIsInGroupProjectLead(currentUser.groups.includes(`${app_acronym}_Pl`));
        setIsInGroupProjectManager(currentUser.groups.includes(`${app_acronym}_Pm`));
        setIsInGroupDeveloper(currentUser.groups.includes(`${app_acronym}_Dt`));
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const states = ['open', 'to-do', 'doing', 'done', 'closed'];

  const handleCreateTask = async (task) => {
    const token = Cookies.get('token');
    const Task_app_Acronym = app_acronym;  
    try {
      const response = await axios.post(`http://localhost:3001/tasks/create`, { ...task, Task_app_Acronym }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks([...tasks, response.data]);
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleSaveTask = async (task, action) => {
    const token = Cookies.get('token');
    let endpoint;
  
    switch (action) {
        case 'saved changes':
            endpoint = `http://localhost:3001/tasks/${task.Task_id}/Release`;
            break;
      case 'released task':
        endpoint = `http://localhost:3001/tasks/${task.Task_id}/Release`;
        break;
      case 'acknowledged task':
        endpoint = `http://localhost:3001/tasks/${task.Task_id}/Acknowledge`;
        break;
      case 'completed task':
        endpoint = `http://localhost:3001/tasks/${task.Task_id}/CompleteOrHalt`;
        break;
      case 'halted task':
        endpoint = `http://localhost:3001/tasks/${task.Task_id}/CompleteOrHalt`;
        break;
      case 'approved task':
        endpoint = `http://localhost:3001/tasks/${task.Task_id}/ApproveOrReject`;
        break;
      case 'rejected task':
        endpoint = `http://localhost:3001/tasks/${task.Task_id}/ApproveOrReject`;
        break;
      default:
        endpoint = `http://localhost:3001/tasks/${task.Task_id}`;
    }
  
    try {
      const response = await axios.put(endpoint, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === 'Access denied') {
      alert('You do not have permission to perform this action');
    }  else {
        console.error('Error updating task:', error);
  };
}
    };
  
  const handleCloseTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(false);
  };

  const handleOpenTaskModal = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="application-page">
      <div className="header">
        <h1>{app_acronym}</h1>
        <p>It is an application about zoo and the animals</p>
        <TaskModal
          isOpen={isTaskModalOpen}
          onRequestClose={handleCloseTaskModal}
          onCreate={handleCreateTask}
          onSave={handleSaveTask}
          app_acronym={app_acronym}
          plans={plans}
          task={selectedTask}
          setPlans={setPlans}
        />
        <PlanModal
          isOpen={isPlanModalOpen}
          onRequestClose={() => setIsPlanModalOpen(false)}
          appAcronym={app_acronym}
          fetchPlans={fetchPlans}
          plans={plans}
          isInGroupProjectManager={isInGroupProjectManager}
        />
        <div className="buttons">
          {isInGroupProjectLead && (
            <button onClick={() => setIsTaskModalOpen(true)}>Create Task</button>
          )}
          <button onClick={() => setIsPlanModalOpen(true)}>Plans</button>
        </div>
      </div>
      <div className="columns">
        {states.map((state) => (
          <div key={state} className="column">
            <h2>{state}</h2>
            {tasks.filter(task => task.Task_state === state).map((task) => (
              <TaskCard key={task.id} task={task} onOpenTask={handleOpenTaskModal} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationPage;
