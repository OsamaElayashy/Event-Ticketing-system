import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Added import
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import { toast } from 'react-toastify';
import EventList from './EventList';
import LoadingSpinner from '../common/LoadingSpinner';
import './AdminEventsPage.css'

const AdminEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();  // Initialized here

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/unauthorized');
      return;
    }
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
      <EventList isAdmin />
    </div>
  );
};

export default AdminEventsPage;