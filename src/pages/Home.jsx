import '../App.css';
import ApplicationCard from '../components/ApplicationCard';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ApplicationModal from '../components/ApplicationModal';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const { isProjectLead } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = Cookies.get('token');
      try {
        const response = await axios.get('http://localhost:3001/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const handleSaveApplication = (application) => {
    const token = Cookies.get('token');
    axios.post('http://localhost:3001/applications/create', application, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setApplications([...applications, response.data]);
        setIsModalOpen(false); // Close the modal after saving
      })
      .catch((error) => {
        console.error('Error creating application:', error);
      });
  };

  const handleEditApplication = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleSaveEditedApplication = (application) => {
    const token = Cookies.get('token');
    axios.put(`http://localhost:3001/applications/${application.App_Acronym}`, application, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setApplications(applications.map(app => app.App_Acronym === application.App_Acronym ? response.data : app));
        setIsModalOpen(false); // Close the modal after saving
      })
      .catch((error) => {
        console.error('Error editing application:', error);
      });
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>Applications</h1>
      {isProjectLead && (
        <button onClick={() => { setSelectedApp(null); setIsModalOpen(true); }}>Create App</button>
      )}
      <ApplicationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSave={selectedApp ? handleSaveEditedApplication : handleSaveApplication}
        application={selectedApp}
      />
      <div className="app-cards">
        {applications.map((app) => (
          <ApplicationCard key={app.App_Acronym} app={app} onEdit={handleEditApplication} />
        ))}
      </div>
    </div>
  );
}

export default Home;
