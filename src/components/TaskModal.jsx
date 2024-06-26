import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';



const TaskModal = ({ isOpen, onRequestClose, onCreate, onSave, task, app_acronym, plans }) => {
  const [taskName, setTaskName] = useState(task ? task.Task_name : '');
  const [taskDescription, setTaskDescription] = useState(task ? task.Task_description : '');
  const [taskNotes, setTaskNotes] = useState('');
  const [existingNotes, setExistingNotes] = useState(task ? task.Task_notes : '');
  const [selectedPlan, setSelectedPlan] = useState(task ? task.Task_plan : '');
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    if (task) {
      setTaskName(task.Task_name);
      setTaskDescription(task.Task_description);
      setExistingNotes(task.Task_notes);
      setSelectedPlan(task.Task_plan);
    } else {
      setTaskName('');
      setTaskDescription('');
      setExistingNotes('');
      setSelectedPlan('');
    }
  }, [task]);


  const handleAddNote = () => {
    const newNote = `${new Date().toISOString()}: [${userId}] ${taskNotes}`;
    setExistingNotes(existingNotes ? `${existingNotes}\n${newNote}` : newNote);
    setTaskNotes('');
    const newTask = {
        ...task,
        Task_name: taskName ? taskName : task.Task_name,
        Task_description: taskDescription ? taskDescription : task.Task_description,
        Task_notes: `${existingNotes}\n${newNote}`
    };
    if (selectedPlan) {
        newTask.Task_plan = selectedPlan;
      } else {
        newTask.Task_plan = task ? task.Task_plan || '' : '';
      }
  
      onSave(newTask);
  };

  const handleSave = (newState, action = 'saved changes') => {
    const formattedNote = `${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}: ${userId}  ${action}  ${taskName || task.Task_name}`;
    const updatedNotes = `${existingNotes}\n${formattedNote}`;  
    const newTask = {
      ...task,
      Task_name: taskName ? taskName : task.Task_name,
      Task_description: taskDescription ? taskDescription : task.Task_description,
      Task_notes: updatedNotes,
      Task_state: newState || task.Task_state,
    };
  
    if (selectedPlan) {
      newTask.Task_plan = selectedPlan;
    } else {
      newTask.Task_plan = task ? task.Task_plan || '' : '';
    }
  
    onSave(newTask, action);
    setTaskNotes('');
    setExistingNotes(updatedNotes);
  };
  

  const handleCreate = () => {
    const formattedNote = `${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}: ${userId} created ${taskName || task.Task_name}`;
    const updatedNotes = `${existingNotes}\n${formattedNote}`;  
    
    const newTask = {
        ...task,
        Task_name: taskName ? taskName : task.Task_name,
        Task_description: taskDescription ? taskDescription : task.Task_description,
        Task_notes: updatedNotes,
      };
  
      if (selectedPlan) {
        newTask.Task_plan = selectedPlan;
      } else {
        newTask.Task_plan = task ? task.Task_plan || '' : '';
      }
  
    onCreate(newTask);
    setTaskNotes('');
    setExistingNotes(updatedNotes);
    };

    const handleStateChange = (newState, action) => {
        handleSave(newState, action);
      };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Task Details"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Task Details</h2>
      <form className="task-form">
        <div className="left-column">
          <div>
            <label><b>ID:</b></label>
            <p>{task ? task.Task_id : 'AUTO GENERATED'}</p>
          </div>
          <div>
            <label><b>Owner:</b></label>
            <p>{task ? task.Task_owner : 'AUTO GENERATED'}</p>
          </div>
          <div>
            <label><b>Name:</b></label>
            <p>{task ? task.Task_name : ""}</p>
            {(!task || (task && !task.Task_state)) && (
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            )}
          </div>
          <div>
            <label><b>Description:</b></label>
            <p>{task ? task.Task_description : ""}</p>
            {(!task || (task && !task.Task_state)) && (
  <textarea
    value={taskDescription}
    onChange={(e) => setTaskDescription(e.target.value)}
  ></textarea>
)}
          </div>
          <div>
            <label><b>Plan:</b></label>
            <p>{task ? task.Task_plan : ""}</p>
            {(!task || (task && (!task.Task_state || task.Task_state === "open"))) && (
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}>
                  {plan.Plan_MVP_name}
                </option>
              ))}
            </select>
            )}
          </div>
          <div className="form-actions">
            {!task && (
              <button type="button" onClick={() => handleCreate('open', 'created task')}>Create Task</button>
            )}

            {task && task.Task_state === 'open' && (
              <>
                <button type="button" onClick={() => handleStateChange('to-do', 'released task')}>Release</button>
                <button type="button" onClick={() => handleSave('open')}>Save</button>
              </>
            )}
            {task && task.Task_state === 'to-do' && (
              <button type="button" onClick={() => handleStateChange('doing', 'acknowledged task')}>Acknowledge</button>
            )}
            {task && task.Task_state === 'doing' && (
              <>
                <button type="button" onClick={() => handleStateChange('done', 'completed task')}>Complete</button>
                <button type="button" onClick={() => handleStateChange('to-do', 'halted task')}>Halt</button>
              </>
            )}
            {task && task.Task_state === 'done' && (
              <>
                <button type="button" onClick={() => handleStateChange('closed', 'approved task')}>Approve</button>
                <button type="button" onClick={() => handleStateChange('doing', 'rejected task')}>Reject</button>
              </>
            )}
            <button type="button" onClick={onRequestClose}>Cancel</button>
          </div>
        </div>
        <div className="right-column">
          <div className="notes-container">
            <label>Notes:</label>
            <div className="existing-notes">
              {existingNotes.split('\n').map((note, index) => (
                <div key={index} className="note">
                  <p>{note}</p>
                </div>
              ))}
            </div>
            {console.log('userId',userId)}
            {task &&
            console.log('task.Task_Owner',task)}

            {task && task.Task_owner === userId && (
                <>
            <textarea
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              placeholder="Write new note here..."
            ></textarea>
            <button type="button" onClick={handleAddNote}>Add Note</button>
            </>
            )
}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
