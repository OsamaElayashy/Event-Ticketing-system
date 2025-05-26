import React from 'react';
import { format } from 'date-fns';
import './BookingComponents.css';

const BookingCard = ({ booking, onCancel }) => {
  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3>{booking.event.title}</h3>
        <span className={`booking-status ${booking.status.toLowerCase()}`}>
          {booking.status}
        </span>
      </div>
      
      <div className="booking-details">
        <div className="detail-row">
          <span>Date:</span>
          <span>{format(new Date(booking.event.date), 'PPP p')}</span>
        </div>
        <div className="detail-row">
          <span>Location:</span>
          <span>{booking.event.location}</span>
        </div>
        <div className="detail-row">
          <span>Tickets:</span>
          <span>{booking.quantity}</span>
        </div>
        <div className="detail-row">
          <span>Total Paid:</span>
          <span>${(booking.event.price * booking.quantity).toFixed(2)}</span>
        </div>
      </div>

      {booking.status === 'CONFIRMED' && (
        <button 
          onClick={() => onCancel(booking._id)}
          className="cancel-booking-btn"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
};

export default BookingCard;