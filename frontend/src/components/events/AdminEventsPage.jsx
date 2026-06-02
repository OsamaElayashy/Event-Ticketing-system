import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import { toast } from 'react-toastify';
import EventList from './EventList';
import LoadingSpinner from '../common/LoadingSpinner';
import { EVENT_ENDPOINTS } from '../../config/api.config';
import './AdminEventsPage.css';

const AdminEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/unauthorized');
      return;
    }
    fetchEvents();
  }, [user, navigate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get(EVENT_ENDPOINTS.ADMIN_EVENTS);
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      await api.put(EVENT_ENDPOINTS.APPROVE_EVENT(eventId));
      toast.success('Event approved successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to approve event');
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      await api.put(EVENT_ENDPOINTS.REJECT_EVENT(eventId));
      toast.success('Event rejected');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to reject event');
    }
  };

  return (
    <div className="admin-events-container">
      <h1>Event Management</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <EventList
          events={events}
          isAdmin
          onApprove={handleApproveEvent}
          onReject={handleRejectEvent}
        />
      )}
    </div>
  );
};

export default AdminEventsPage;
