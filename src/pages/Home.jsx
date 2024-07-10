import '../App.css';
import ApplicationCard from '../components/ApplicationCard';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ApplicationModal from '../components/ApplicationModal';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Home() {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const { isProjectLead} = useContext(AuthContext);

  useEffect(() => {
 

    fetchApplications();
  }, []);

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
   
 // WebSocket connection
 useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001');
 
  ws.onopen = () => {
    console.log('Connected to WebSocket server');
  };
 
  ws.onmessage = (event) => {
   const message = JSON.parse(event.data);
 
   if (message.type === 'APPLICATION_CREATED' || message.type === 'APPLICATION_UPDATED') {
      fetchApplications();
   } 
 };
 
  ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
  };
 
  return () => {
    ws.close();
  };
 }, []);
 

 const handleCreateApplication = (application) => {
  const token = Cookies.get('token');
  axios.post('http://localhost:3001/applications/create', application, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      setApplications([...applications, response.data]);
      setIsModalOpen(false); // Close the modal after saving
      toast.success('Application created successfully');
    })
    .catch((error) => {
      console.error('Error creating application:', error.response);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Display the error message from the server
      } else {
        toast.error('An unexpected error occurred'); // Display a generic error message
      }
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
        toast.success('Application updated successfully');
        setIsModalOpen(false); // Close the modal after saving
      })
      .catch((error) => {
        if (error.response.status === 403) {
        toast.error('You do not have permission to edit the application.');
        } else if (error.response.status === 409) {
        toast.error('Someone is currently editting the application.');
        }
        else if (error.response.status === 400) {
          toast.error('App start date and App end date cannot be null')
        }
        else {
          toast.error('An unexpected error occurred');
        }
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
        onSave={selectedApp ? handleSaveEditedApplication : handleCreateApplication}
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
