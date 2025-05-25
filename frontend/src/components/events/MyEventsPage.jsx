import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import { toast } from 'react-toastify';
import EventList from './EventList';
import LoadingSpinner from '../common/LoadingSpinner';
import './MyEventsPage.css'

const MyEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'organizer') {
      navigate('/unauthorized');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/organizer');
        setEvents(response.data);
      } catch (error) {
        toast.error('Failed to load your events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="my-events-container">
      <div className="my-events-header">
        <h1>My Events</h1>
        <button
          onClick={() => navigate('/my-events/new')}
          className="create-event-button"
        >
          Create New Event
        </button>
      </div>

      <EventList events={events} isOrganizer />
    </div>
  );
};

export default MyEventsPage;