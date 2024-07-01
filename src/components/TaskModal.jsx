import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import '../styles/TaskModal.css';

const TaskModal = ({ isOpen, onRequestClose, onCreate, onSave, task, app_acronym, plans, isAbleToToDo, isAbleToCreate, isAbleToOpen, isAbleToDone, isAbleToDoing, isAbleToClosed }) => {
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

  var newNoteBeforeCreateTask = ''
  const handleAddNoteBeforeCreateTask = () => {
    newNoteBeforeCreateTask = `${new Date().toISOString()}: [${userId}] ${taskNotes}`;
    setExistingNotes(existingNotes ? `${newNoteBeforeCreateTask}\n${existingNotes}` : newNoteBeforeCreateTask);
    setTaskNotes('');
  };

  const handleAddNote = () => {
    const newNote = `${new Date().toISOString()}: [${userId}] ${taskNotes}`;
    setExistingNotes(existingNotes ? `${newNote}\n${existingNotes}` : newNote);
    setTaskNotes('');
    const newTask = {
      ...task,
      Task_name: taskName ? taskName : task.Task_name,
      Task_description: taskDescription ? taskDescription : task.Task_description,
      Task_notes: `${newNote}\n${existingNotes}`,
      Task_owner: userId
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
    const updatedNotes = `${formattedNote}\n${existingNotes}`;
    const newTask = {
      ...task,
      Task_name: taskName ? taskName : task.Task_name,
      Task_description: taskDescription ? taskDescription : task.Task_description,
      Task_notes: updatedNotes,
      Task_owner: userId
    };

    if (action === 'saved changes') {
      newTask.Task_state = task && task.Task_state;
    } else {
      newTask.Task_state = newState;
    }

    if (selectedPlan) {
      newTask.Task_plan = selectedPlan;
    } else {
      newTask.Task_plan = task ? task.Task_plan || '' : '';
    }

    onSave(newTask, action);
    setTaskNotes('');
    setExistingNotes(updatedNotes);
  };

  const handleCreate = (newState, action = 'created task') => {
    const formattedNote = `${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}: ${userId} created ${taskName || task.Task_name}`;
    const updatedNotes = `${newNoteBeforeCreateTask}\n${formattedNote}\n${existingNotes}`;
    newNoteBeforeCreateTask = ''
    const newTask = {
      ...task,
      Task_name: taskName ? taskName : task.Task_name,
      Task_description: taskDescription ? taskDescription : '',
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

  const handleStateChange = (state, newState, action) => {
    let canExecute = false;
    switch (state) {
      case 'open':
        canExecute = isAbleToOpen;
        break;
      case 'to-do':
        canExecute = isAbleToToDo;
        break;
      case 'doing':
        canExecute = isAbleToDoing;
        break;
      case 'done':
        canExecute = isAbleToDone;
        break;
      case 'closed':
        canExecute = isAbleToClosed;
        break;
      default:
        canExecute = true; // Allow note addition and basic save by default
    }
    if (canExecute) {
      handleSave(newState, action);
    } else {
      alert('You do not have permission to perform this action');
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Task Details"
      className={`modal`}
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
                <button type="button" onClick={() => handleStateChange('open', 'to-do', 'released task')}>Release</button>
                <button type="button" onClick={() => handleSave('open')}>Save</button>
              </>
            )}
            {task && task.Task_state === 'to-do' && (
              <button type="button" onClick={() => handleStateChange('to-do','doing', 'acknowledged task')}>Acknowledge</button>
            )}
            {task && task.Task_state === 'doing' && (
              <>
                <button type="button" onClick={() => handleStateChange('doing','done', 'completed task')}>Complete</button>
                <button type="button" onClick={() => handleStateChange('doing','to-do', 'halted task')}>Halt</button>
              </>
            )}
            {task && task.Task_state === 'done' && (
              <>
                <button type="button" onClick={() => handleStateChange('done','closed', 'approved task')}>Approve</button>
                <button type="button" onClick={() => handleStateChange('done','doing', 'rejected task')}>Reject</button>
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
            {task && task.Task_state === "open" && isAbleToOpen ? (
  <>
    <textarea
      value={taskNotes}
      onChange={(e) => setTaskNotes(e.target.value)}
      placeholder="Write new note here..."
    ></textarea>
    <button type="button" onClick={handleAddNote}>Add Note</button>
  </>
) : task && task.Task_state === "to-do" && isAbleToToDo ? (
  <>
    <textarea
      value={taskNotes}
      onChange={(e) => setTaskNotes(e.target.value)}
      placeholder="Write new note here..."
    ></textarea>
    <button type="button" onClick={handleAddNote}>Add Note</button>
  </>
) : task && task.Task_state === "doing" && isAbleToDoing ? (
  <>
    <textarea
      value={taskNotes}
      onChange={(e) => setTaskNotes(e.target.value)}
      placeholder="Write new note here..."
    ></textarea>
    <button type="button" onClick={handleAddNote}>Add Note</button>
  </>
) : task && task.Task_state === "done" && isAbleToDone ? (
  <>
    <textarea
      value={taskNotes}
      onChange={(e) => setTaskNotes(e.target.value)}
      placeholder="Write new note here..."
    ></textarea>
    <button type="button" onClick={handleAddNote}>Add Note</button>
  </>
) : task && task.Task_state === "closed" && isAbleToClosed ? (
  <>
    <textarea
      value={taskNotes}
      onChange={(e) => setTaskNotes(e.target.value)}
      placeholder="Write new note here..."
    ></textarea>
    <button type="button" onClick={handleAddNote}>Add Note</button>
  </>
) : !task && isAbleToCreate ? (
  <>
    <textarea
      value={taskNotes}
      onChange={(e) => setTaskNotes(e.target.value)}
      placeholder="Write new note here..."
    ></textarea>
    <button type="button" onClick={handleAddNoteBeforeCreateTask}>Add Note</button>
  </>
) : null}

          
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
