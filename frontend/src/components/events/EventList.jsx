import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { EVENT_ENDPOINTS } from '../../config/api.config';
import EventCard from './EventCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import './EventList.css';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    date: 'all'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get(EVENT_ENDPOINTS.GET_APPROVED_EVENTS);
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const handleCategoryChange = (e) => {
    setFilters(prev => ({
      ...prev,
      category: e.target.value
    }));
  };

  const handleDateFilter = (e) => {
    setFilters(prev => ({
      ...prev,
      date: e.target.value
    }));
  };

  const filterEvents = () => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          event.location.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'all' || event.category === filters.category;
      
      let matchesDate = true;
      const eventDate = new Date(event.date);
      const today = new Date();
      
      switch (filters.date) {
        case 'today':
          matchesDate = eventDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          matchesDate = eventDate >= today && eventDate <= nextWeek;
          break;
        case 'month':
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          matchesDate = eventDate >= today && eventDate <= nextMonth;
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  };

  const filteredEvents = filterEvents();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={handleSearch}
            className="search-input"
          />
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Concert">Concert</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={filters.date}
            onChange={handleDateFilter}
            className="date-filter"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <EventCard
              key={event._id}
              event={event}
              onClick={() => navigate(`/events/${event._id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="no-events">
          <p>No events found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default EventList;