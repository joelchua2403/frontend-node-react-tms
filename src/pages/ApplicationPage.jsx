import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import PlanModal from '../components/PlanModal';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/ApplicationPage.css';

const ApplicationPage = () => {
  const { app_acronym } = useParams();
  const [tasks, setTasks] = useState([]);
    const [plans, setPlans] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
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
      fetchPlans();
  

    fetchTasks();
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
      console.log("tasks:", tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const states = ['open', 'to-do', 'doing', 'done', 'closed'];

  const handleCreateTask = async (task) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(`http://localhost:3001/tasks/create`, { ...task, app_acronym }, {
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

  const handleSaveTask = async (task) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.put(`http://localhost:3001/tasks/${task.Task_id}`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  

const handleCloseTaskModal = async () => {
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
        />
          <PlanModal
          isOpen={isPlanModalOpen}
          onRequestClose={() => setIsPlanModalOpen(false)}
          appAcronym={app_acronym}
        />
        <div className="buttons">
          <button onClick={() => setIsTaskModalOpen(true)}>Create Task</button>
          <button onClick={() => setIsPlanModalOpen(true)}  >Plans</button>
        </div>
      </div>
      <div className="columns">
        {states.map((state) => (
          <div key={state} className="column">
            <h2>{state}</h2>
            {tasks.filter(task => task.Task_state === state).map((task) => (
              <TaskCard key={task.id} task={task} onOpenTask={handleOpenTaskModal}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationPage;
