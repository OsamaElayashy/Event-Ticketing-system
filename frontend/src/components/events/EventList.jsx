import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { EVENT_ENDPOINTS } from '../../config/api.config';
import EventCard from './EventCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import './EventList.css';

const EventList = ({ isAdmin = false }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const endpoint = isAdmin ? EVENT_ENDPOINTS.ADMIN_EVENTS : EVENT_ENDPOINTS.ALL_EVENTS;
        const response = await api.get(endpoint, {
          params: {
            search: searchTerm,
            category: categoryFilter !== 'all' ? categoryFilter : undefined
          }
        });
        setEvents(response.data);
      } catch (error) {
        toast.error('Failed to load events');
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [searchTerm, categoryFilter, isAdmin]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled automatically by the useEffect
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="events-container">
      <div className="events-filters">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="arts">Arts & Theater</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              isAdmin={isAdmin}
              onEventClick={() => navigate(`/events/${event._id}`)}
            />
          ))
        ) : (
          <p className="no-events">No events found</p>
        )}
      </div>
    </div>
  );
};

export default EventList;