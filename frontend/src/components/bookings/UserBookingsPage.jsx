import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserBookings, cancelBooking } from '../../api/bookingApi';
import BookingCard from './BookingCard';
import './BookingComponents.css';

const UserBookingsPage = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userBookings = await getUserBookings(currentUser._id);
        setBookings(userBookings);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="loading-message">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="bookings-page-container">
      <h2>Your Bookings</h2>
      {bookings.length === 0 ? (
        <div className="no-bookings-message">You haven't made any bookings yet.</div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <BookingCard 
              key={booking._id} 
              booking={booking} 
              onCancel={handleCancelBooking} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;