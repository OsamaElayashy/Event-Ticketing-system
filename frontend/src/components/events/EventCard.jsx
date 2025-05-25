import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import './EventCard.css'

const EventCard = ({ event, isAdmin = false, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-image">
        {imageError ? (
          <div className="image-placeholder">
            <span>{event.title.charAt(0)}</span>
          </div>
        ) : (
          <img
            src={event.imageUrl || '/default-event.jpg'}
            alt={event.title}
            onError={handleImageError}
          />
        )}
        {isAdmin && (
          <div className="event-status-badge">
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </div>
        )}
      </div>
      <div className="event-details">
        <h3>{event.title}</h3>
        <p className="event-date">
          {format(new Date(event.date), 'PPP p')}
        </p>
        <p className="event-location">{event.location}</p>
        <div className="event-footer">
          <span className="event-price">
            {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
          </span>
          <span className={`event-availability ${event.ticketsAvailable === 0 ? 'sold-out' : ''}`}>
            {event.ticketsAvailable === 0 ? 'Sold Out' : `${event.ticketsAvailable} left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;