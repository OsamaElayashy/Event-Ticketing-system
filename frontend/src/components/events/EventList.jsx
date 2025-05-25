import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import EventCard from './EventCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import './EventList.css'

const EventList = ({ isAdmin = false }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const endpoint = isAdmin ? '/events/admin' : '/events';
        const response = await api.get(endpoint, {
          params: {
            search: searchTerm,
            category: categoryFilter !== 'all' ? categoryFilter : undefined
          }
        });
        setEvents(response.data);
      } catch (error) {
        toast.error('Failed to load events');
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

  return (
    <div className="event-list-container">
      <div className="event-list-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        
        <div className="filter-section">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts & Theater</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="event-grid">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard 
                key={event._id} 
                event={event} 
                isAdmin={isAdmin}
                onClick={() => navigate(`/events/${event._id}`)}
              />
            ))
          ) : (
            <p className="no-events">No events found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventList;