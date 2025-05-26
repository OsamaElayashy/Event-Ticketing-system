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
    if (user?.role !== 'admin') {
      navigate('/unauthorized');
      return;
    }
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
    fetchEvents();
  }, [user, navigate]);

  const handleApproveEvent = async (eventId) => {
    try {
      await api.put(`/events/admin/${eventId}/approve`);
      toast.success('Event approved successfully');
    } catch (error) {
      toast.error('Failed to approve event');
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      await api.put(`/events/admin/${eventId}/reject`);
      toast.success('Event rejected');
    } catch (error) {
      toast.error('Failed to reject event');
    }
  };

  return (
    <div className="admin-events-container">
      <h1>Event Management</h1>
      {loading ? <LoadingSpinner /> : <EventList events={events} isAdmin />}
    </div>
  );
};

export default AdminEventsPage;