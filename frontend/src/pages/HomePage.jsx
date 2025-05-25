import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import EventList from '../components/events/EventList';
import WelcomeBanner from '../components/common/WelcomeBanner';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const HomePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events', {
          params: {
            status: 'approved', // Only show approved events
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
  }, [searchTerm, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will automatically trigger when searchTerm changes
  };

  return (
    <div className="home-page">
      <WelcomeBanner user={user} />
      
      <div className="search-filter-container">
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
          <label htmlFor="category">Filter by category:</label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts & Theater</option>
            <option value="conference">Conferences</option>
            <option value="workshop">Workshops</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h2 className="events-title">Upcoming Events</h2>
          {events.length > 0 ? (
            <EventList events={events} />
          ) : (
            <p className="no-events">No events found. Try adjusting your search.</p>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;