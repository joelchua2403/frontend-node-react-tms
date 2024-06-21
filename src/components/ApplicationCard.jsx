// ApplicationCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ApplicationCard = ({ app }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
  return (
    <div className="app-card">
        <p>Acronym: {app.App_Acronym}</p>
      <p>Rnum: {app.App_Rnumber}</p>
      <p>Desc: {app.App_Description}</p>
      <p>Duration: {formatDate(app.App_startDate)} - {formatDate(app.App_endDate)}</p>
      <Link to={`/application/${app.App_Acronym}`}>Edit</Link>
    </div>
  );
};

export default ApplicationCard;
