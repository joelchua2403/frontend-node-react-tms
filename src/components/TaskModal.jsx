import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';

const TaskModal = ({ isOpen, onRequestClose, onSave, app_acronym, task, plans }) => {
  const [taskName, setTaskName] = useState(task ? task.name : '');
  const [taskDescription, setTaskDescription] = useState(task ? task.description : '');
  const [taskNotes, setTaskNotes] = useState('');
  const [existingNotes, setExistingNotes] = useState(task ? task.notes : '');
  const [selectedPlan, setSelectedPlan] = useState(task ? task.plan : '');


  const handleSave = () => {
    const newTask = {
      name: taskName,
      description: taskDescription,
      plan: selectedPlan,
      notes: existingNotes + '\n' + new Date().toISOString() + ': ' + taskNotes,
    };
    onSave(newTask);
    setTaskName('');
    setTaskDescription('');
    setTaskNotes('');
    setSelectedPlan('');
    setExistingNotes('');
  };

  const handleAddNote = () => {
    const newNote = existingNotes + '\n' + new Date().toISOString() + ': ' + taskNotes;
    setExistingNotes(newNote);
    setTaskNotes('');
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Task"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Open Task</h2>
      <form className="task-form">
        <div className="left-column">
          <div>
            <label>ID:</label>
            <p>{task ? task.id : 'AUTO GENERATED'}</p>
          </div>
          <div>
            <label>Owner:</label>
            <p>{task ? task.owner : 'AUTO GENERATED'}</p>
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
          <button type="button" onClick={handleSave}>
            Save Changes
          </button>
          <button type="button" onClick={onRequestClose}>
            Cancel
          </button>
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
            <button type="button" onClick={handleAddNote}>
              Add Note
            </button>
          </div>
        </div>
        
      </form>
    </Modal>
  );
};

export default TaskModal;
