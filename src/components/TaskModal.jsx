import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';

const TaskModal = ({ isOpen, onRequestClose, onCreate, onSave, task, app_acronym }) => {
  const [taskName, setTaskName] = useState(task ? task.Task_name : '');
  const [taskDescription, setTaskDescription] = useState(task ? task.Task_description : '');
  const [taskNotes, setTaskNotes] = useState('');
  const [existingNotes, setExistingNotes] = useState(task ? task.Task_notes : '');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(task ? task.Task_plan : '');

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
  }, [app_acronym]);

  const handleSave = () => {
    const newTask = {
      ...task,
      Task_name: taskName,
      Task_description: taskDescription,
      Task_plan: selectedPlan,
      Task_notes: existingNotes + '\n' + new Date().toISOString() + ': ' + taskNotes,
    };
    onCreate(newTask);
  };

  const handleStateChange = (newState) => {
    onSave({ ...task, Task_state: newState });
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
            <label>ID:</label>
            <p>{task ? task.Task_id : 'AUTO GENERATED'}</p>
          </div>
          <div>
            <label>Owner:</label>
            <p>{task ? task.Task_owner : 'AUTO GENERATED'}</p>
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label>Plan:</label>
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
          </div>
          <div className="form-actions">
              {!task && (
                
                <button type="button" onClick={handleSave}>Create Task</button>
                )}

            {task && task.Task_state === 'open' && (
              <>
                <button type="button" onClick={() => handleStateChange('to-do')}>Release</button>
                <button type="button" onClick={handleSave}>Save Changes</button>
              </>
            )}
            {task && task.Task_state === 'to-do' && (
              <button type="button" onClick={() => handleStateChange('doing')}>Acknowledge</button>
            )}
            {task && task.Task_state === 'doing' && (
              <>
                <button type="button" onClick={() => handleStateChange('done')}>Complete</button>
                <button type="button" onClick={() => handleStateChange('to-do')}>Halt</button>
              </>
            )}
            {task && task.Task_state === 'done' && (
              <>
                <button type="button" onClick={() => handleStateChange('closed')}>Approve</button>
                <button type="button" onClick={() => handleStateChange('doing')}>Reject</button>
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
            <textarea
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              placeholder="Write new note here..."
            ></textarea>
            <button type="button" onClick={handleSave}>Add Note</button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
