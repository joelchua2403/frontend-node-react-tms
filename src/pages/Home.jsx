import '../App.css';
import ApplicationCard from '../components/ApplicationCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ApplicationModal from '../components/ApplicationModal';

function Home() {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      })
      .catch((error) => {
        console.error('Error creating application:', error);
      });
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>Applications</h1>
      <button onClick={() => setIsModalOpen(true)}>Create App</button>
      <ApplicationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSave={handleSaveApplication}
      />
      <div className="app-cards">
        {applications.map((app) => (
          <ApplicationCard key={app.app_acronym} app={app} />
        ))}
      </div>
    </div>
  );
}

export default Home;
