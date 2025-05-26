import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import { EVENT_ENDPOINTS } from '../../config/api.config';
import BookTicketForm from '../booking/BookTicketForm';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(EVENT_ENDPOINTS.EVENT_BY_ID(id));
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(EVENT_ENDPOINTS.DELETE_EVENT(id));
      navigate('/my-events');
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="info">Event not found</Alert>
      </Box>
    );
  }

  const isOrganizer = user?.role === 'Organizer' && event.organizerId === user._id;
  const isPastEvent = new Date(event.date) < new Date();
  const isSoldOut = event.bookedTickets >= event.capacity;
  const isPending = event.status === 'pending';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                color="primary"
                sx={{ mr: 1 }}
              />
              {isPending && (
                <Chip 
                  label="Pending Approval"
                  color="warning"
                  sx={{ mr: 1 }}
                />
              )}
              {isPastEvent && (
                <Chip 
                  label="Past Event"
                  color="error"
                  sx={{ mr: 1 }}
                />
              )}
              {isSoldOut && (
                <Chip 
                  label="Sold Out"
                  color="error"
                />
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {event.location}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Capacity
                </Typography>
                <Typography variant="body1">
                  {(event.bookedTickets ?? 0)} / {(event.capacity ?? 0)} tickets booked
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="body1">
                  ${event.price !== undefined ? event.ticketPrice.toFixed(2) : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            {event.imageUrl && (
              <Box
                component="img"
                src={event.imageUrl}
                alt={event.title}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 2
                }}
              />
            )}

            {isOrganizer ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleEdit}
                  disabled={isPastEvent || isPending}
                >
                  Edit Event
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleDelete}
                  disabled={isPastEvent || isPending}
                >
                  Delete Event
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setShowBookingForm(true)}
                disabled={isPastEvent || isSoldOut || !user || isPending}
              >
                {!user ? 'Login to Book' :
                  isPending ? 'Event Pending Approval' :
                  isPastEvent ? 'Event has ended' :
                  isSoldOut ? 'Sold Out' :
                  'Book Tickets'}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {showBookingForm && (
        <BookTicketForm
          event={event}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            setShowBookingForm(false);
            // Refresh event data
            api.get(EVENT_ENDPOINTS.EVENT_BY_ID(id))
              .then(response => setEvent(response.data))
              .catch(err => console.error('Error refreshing event:', err));
          }}
        />
      )}
    </Box>
  );
};

export default EventDetails;