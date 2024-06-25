import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from '../styles/ApplicationModal.module.css'; // Import as a module

const ApplicationModal = ({ isOpen, onRequestClose, onSave, application = null }) => {
  const [name, setName] = useState('');
  const [rNumber, setRNumber] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [createGroup, setCreateGroup] = useState('');
  const [openGroup, setOpenGroup] = useState('');
  const [todoGroup, setTodoGroup] = useState('');
  const [doingGroup, setDoingGroup] = useState('');
  const [doneGroup, setDoneGroup] = useState('');
  const [groups, setGroups] = useState([]);
  const isEditMode = !!application;

  useEffect(() => {
    const fetchGroups = async () => {
      const token = Cookies.get('token');
      try {
        const response = await axios.get('http://localhost:3001/groups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
    console.log('isEditMode:', isEditMode, 'application:', application)
  }, []);

  useEffect(() => {
    if (isEditMode && application) {
      setName(application.App_Acronym);
      setRNumber(application.App_Rnumber);
      setDescription(application.App_Description);
      setStartDate(application.App_startDate);
      setEndDate(application.App_endDate);
      setCreateGroup(application.App_permit_Create);
      setOpenGroup(application.App_permit_Open);
      setTodoGroup(application.App_permit_toDoList);
      setDoingGroup(application.App_permit_Doing);
      setDoneGroup(application.App_permit_Done);
    } else {
      setName('');
      setRNumber('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCreateGroup('');
      setOpenGroup('');
      setTodoGroup('');
      setDoingGroup('');
      setDoneGroup('');
    }
  }, [isEditMode, application]);

  const handleSave = () => {
    const newApplication = {
      App_Acronym: name,
      App_Rnumber: rNumber,
      App_Description: description,
      App_startDate: startDate,
      App_endDate: endDate,
      App_permit_Create: createGroup,
      App_permit_Open: openGroup,
      App_permit_toDoList: todoGroup,
      App_permit_Doing: doingGroup,
      App_permit_Done: doneGroup,
    };
    onSave(newApplication);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={isEditMode ? "Edit Application" : "Create Application"}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>{isEditMode ? "Edit App" : "Create App"}</h2>
      <form className={styles.appForm}>
        <div className={styles.column}>
          <div className={styles.formGroup}>
            <label className={styles.mandatory}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              readOnly={isEditMode}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.mandatory}>Rnumber:</label>
            <input
              type="number"
              value={rNumber}
              onChange={(e) => setRNumber(e.target.value)}
              required
              readOnly={isEditMode}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              readOnly={isEditMode}
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.mandatory}>Start:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.mandatory}>End:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.formGroup}>
            <label>Create:</label>
            <select
              value={createGroup}
              onChange={(e) => setCreateGroup(e.target.value)}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Open:</label>
            <select
              value={openGroup}
              onChange={(e) => setOpenGroup(e.target.value)}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Todo:</label>
            <select
              value={todoGroup}
              onChange={(e) => setTodoGroup(e.target.value)}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Doing:</label>
            <select
              value={doingGroup}
              onChange={(e) => setDoingGroup(e.target.value)}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Done:</label>
            <select
              value={doneGroup}
              onChange={(e) => setDoneGroup(e.target.value)}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
       
        </div>
      </form>
      <button type="button" onClick={handleSave}>
            {isEditMode ? "Save Changes" : "Create"}
          </button>
    </Modal>
  );
};

export default ApplicationModal;
