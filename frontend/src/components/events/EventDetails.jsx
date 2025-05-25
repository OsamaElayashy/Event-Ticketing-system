import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import { EVENT_ENDPOINTS } from '../../config/api.config';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
//import BookTicketForm from '../bookings/BookTicketForm';
import LoadingSpinner from '../common/LoadingSpinner';
import './EventDetails.css'

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(EVENT_ENDPOINTS.EVENT_BY_ID(id));
        setEvent(response.data);
        setIsOrganizer(user?.role === 'Organizer' && user?._id === response.data.organizer._id);
      } catch (error) {
        toast.error('Failed to load event details');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(EVENT_ENDPOINTS.DELETE_EVENT(id));
        toast.success('Event deleted successfully');
        navigate(isOrganizer ? '/my-events' : '/events');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="event-details-container">
      <div className="event-header">
        <h1>{event.title}</h1>
        {(isOrganizer || user?.role === 'Admin') && (
          <div className="event-actions">
            <button
              onClick={() => navigate(`/my-events/${id}/edit`)}
              className="edit-button"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="event-main">
        <div className="event-image-container">
          <img
            src={event.imageUrl || '/default-event.jpg'}
            alt={event.title}
            onError={(e) => {
              e.target.src = '/default-event.jpg';
            }}
          />
        </div>

        <div className="event-info">
          <div className="event-meta">
            <p className="event-date">
              <strong>Date:</strong> {format(new Date(event.date), 'PPPPp')}
            </p>
            <p className="event-location">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="event-category">
              <strong>Category:</strong> {event.category}
            </p>
            <p className="event-price">
              <strong>Price:</strong> {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
            </p>
            <p className="event-tickets">
              <strong>Tickets Available:</strong> {event.ticketsAvailable}
            </p>
            <p className="event-organizer">
              <strong>Organizer:</strong> {event.organizer.name}
            </p>
          </div>

         
        </div>
      </div>

      <div className="event-description">
        <h3>Description</h3>
        <p>{event.description || 'No description provided.'}</p>
      </div>

      {user && user.role !== 'Organizer' && event.ticketsAvailable > 0 && (
        <div className="booking-section">
          <h3>Book Tickets</h3>
          {/* Add BookTicketForm component here when ready */}
        </div>
      )}
    </div>
  );
};

export default EventDetails;