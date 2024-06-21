import '../App.css';
import ApplicationCard from '../components/ApplicationCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Home() {
  const [applications, setApplications] = useState([]);

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

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>Applications</h1>
      <button>Create App</button>
      <div className="app-cards">
        {applications.map((app) => (
          <ApplicationCard key={app.app_acronym} app={app} />
        ))}
      </div>
    </div>
  );
}

export default Home;
