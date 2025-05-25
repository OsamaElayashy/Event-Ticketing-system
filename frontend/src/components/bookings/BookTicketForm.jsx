import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import { BOOKING_ENDPOINTS } from '../../config/api.config';
import { toast } from 'react-toastify';
import './BookTicketForm.css';

const BookTicketForm = ({ event }) => {
  const { user } = useAuth();
  const [ticketCount, setTicketCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book tickets');
      return;
    }

    if (ticketCount < 1 || ticketCount > event.ticketsAvailable) {
      toast.error('Invalid ticket quantity');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(BOOKING_ENDPOINTS.CREATE_BOOKING, {
        eventId: event._id,
        tickets: ticketCount
      });
      toast.success(`Booked ${ticketCount} ticket(s) successfully!`);
      // Refresh event data or redirect as needed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h3>Book Tickets</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ticketCount">Number of Tickets</label>
          <input
            type="number"
            id="ticketCount"
            min="1"
            max={event.ticketsAvailable}
            value={ticketCount}
            onChange={(e) => setTicketCount(Math.max(1, Math.min(
              event.ticketsAvailable, 
              parseInt(e.target.value) || 1
            )))}
          />
          <small>
            Available: {event.ticketsAvailable} | Max: {event.ticketsAvailable} per order
          </small>
        </div>
        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading || !event.ticketsAvailable}
        >
          {isLoading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
};

export default BookTicketForm;