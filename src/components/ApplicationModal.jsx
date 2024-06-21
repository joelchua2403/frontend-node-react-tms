import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from '../styles/ApplicationModal.module.css'; // Import as a module

const ApplicationModal = ({ isOpen, onRequestClose, onSave }) => {
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
  }, []);

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
      contentLabel="Create Application"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Create App</h2>
      <form className={styles.appForm}>
        <div className={styles.formGroup}>
          <label className="mandatory">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className="mandatory">Rnumber:</label>
          <input
            type="number"
            value={rNumber}
            onChange={(e) => setRNumber(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label className="mandatory">Start:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className="mandatory">End:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
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
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <button type="button" onClick={handleSave}>Create</button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplicationModal;
