import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import { EVENT_ENDPOINTS } from '../config/api.config';
import EventList from '../components/events/EventList';
import WelcomeBanner from '../components/common/WelcomeBanner';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get(EVENT_ENDPOINTS.ALL_EVENTS);
        setAllEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        toast.error('Failed to load events');
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filterEvents = () => {
      let filtered = [...allEvents];

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
        );
      }

      // Apply category filter
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(event => event.category === categoryFilter);
      }

      setFilteredEvents(filtered);
    };

    filterEvents();
  }, [searchTerm, categoryFilter, allEvents]);

  const handleAddEvent = () => {
    navigate('/events/new');
  };

  return (
    <div className="home-container">
      <WelcomeBanner user={user} />
      
      <div className="home-content">
        <div className="home-header">
          <h1>Upcoming Events</h1>
          {user?.role === 'Organizer' && (
            <button 
              className="add-event-button"
              onClick={handleAddEvent}
            >
              + Add New Event
            </button>
          )}
        </div>

        <div className="search-filters">
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

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="events-section">
            {filteredEvents.length > 0 ? (
              <EventList events={filteredEvents} />
            ) : (
              <div className="no-events">
                <p>No events found</p>
                {user?.role === 'Organizer' && (
                  <button 
                    className="create-first-event-button"
                    onClick={handleAddEvent}
                  >
                    Create Your First Event
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;