// ApplicationCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ApplicationCard = ({ app, onEdit }) => {
  const { isProjectLead} = useContext(AuthContext);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
      let truncatedDescription = 'No description available';
      if (app.App_Description) {
        truncatedDescription = app.App_Description.length > 40 ? `${app.App_Description.slice(0, 40)}...` : app.App_Description;
      }
    
  return (
    <div className="app-card">
        <Link to={`/application/${app.App_Acronym}`} className="app-link">
        <p>Rnum: {app.App_Rnumber}</p>
        <p>Acronym: {app.App_Acronym}</p>
      <p>Desc: {truncatedDescription}</p>
      <p>Duration: {formatDate(app.App_startDate)} - {formatDate(app.App_endDate)}</p>
      </Link>
      {isProjectLead && <button onClick={() => onEdit(app)}>Edit</button>}
    </div>
  );
};

export default ApplicationCard;
