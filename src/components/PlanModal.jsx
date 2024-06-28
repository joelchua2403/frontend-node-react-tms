import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/PlanModal.css';

const PlanModal = ({ isOpen, onRequestClose, appAcronym, fetchPlans, plans, setPlans, isInGroupProjectManager }) => {
  
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanStartDate, setNewPlanStartDate] = useState('');
  const [newPlanEndDate, setNewPlanEndDate] = useState('');
  
  const handleCreatePlan = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        `http://localhost:3001/plans`,
        {
          Plan_MVP_name: newPlanName,
          Plan_startDate: newPlanStartDate,
          Plan_endDate: newPlanEndDate,
          Plan_app_Acronym: appAcronym,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    //   setPlans([...plans, response.data]);
      setNewPlanName('');
      setNewPlanStartDate('');
      setNewPlanEndDate('');
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Plans"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Plans</h2>
      <div className="plan-list">
        <table>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.Plan_MVP_name}>
                <td>{plan.Plan_MVP_name}</td>
                <td>{new Date(plan.Plan_startDate).toLocaleDateString()}</td>
                <td>{new Date(plan.Plan_endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {isInGroupProjectManager && (
      <div className="create-plan">
        <h3>Create New Plan</h3>
        <label>Plan Name:</label>
        <input
          type="text"
          value={newPlanName}
          onChange={(e) => setNewPlanName(e.target.value)}
        />
        <label>Plan Start Date:</label>
        <input
          type="date"
          value={newPlanStartDate}
          onChange={(e) => setNewPlanStartDate(e.target.value)}
        />
        <label>Plan End Date:</label>
        <input
          type="date"
          value={newPlanEndDate}
          onChange={(e) => setNewPlanEndDate(e.target.value)}
        />
        <button onClick={handleCreatePlan}>Create</button>
      </div>
        )}
    </Modal>
  );
};

export default PlanModal;
