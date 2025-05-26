import PropTypes from 'prop-types';
import { format } from 'date-fns';
import './EventCard.css';

const EventCard = ({ event, onClick }) => {
  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getAvailabilityClass = () => {
    const availability = (event.ticketsAvailable / event.totalTickets) * 100;
    if (availability === 0) return 'sold-out';
    if (availability <= 20) return 'limited';
    return 'available';
  };

  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-image">
        <img
          src={event.imageUrl || '/default-event.jpg'}
          alt={event.title}
          onError={(e) => {
            e.target.src = '/default-event.jpg';
          }}
        />
        <div className={`availability-badge ${getAvailabilityClass()}`}>
          {event.ticketsAvailable === 0
            ? 'Sold Out'
            : `${event.ticketsAvailable} tickets left`}
        </div>
      </div>

      <div className="event-content">
        <div className="event-header">
          <h3 className="event-title">{event.title}</h3>
          <span className="event-price">{formatPrice(event.price)}</span>
        </div>

        <div className="event-details">
          <div className="detail-item">
            <i className="far fa-calendar"></i>
            <span>{format(new Date(event.date), 'EEE, MMM d, yyyy')}</span>
          </div>
          <div className="detail-item">
            <i className="far fa-clock"></i>
            <span>{format(new Date(event.date), 'h:mm a')}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.location}</span>
          </div>
        </div>

        <div className="event-footer">
          <span className={`category-tag ${event.category.toLowerCase()}`}>
            {event.category}
          </span>
          <span className="organizer">
            By {event.organizer.name}
          </span>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    ticketsAvailable: PropTypes.number.isRequired,
    totalTickets: PropTypes.number.isRequired,
    organizer: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default EventCard;