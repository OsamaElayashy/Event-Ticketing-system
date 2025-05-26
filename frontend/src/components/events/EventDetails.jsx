import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to fetch event details
      // Simulated API response
      const response = {
        _id: id,
        title: 'Sample Event',
        description: 'This is a detailed description of the event.',
        date: new Date(),
        location: 'Sample Location',
        category: 'Music',
        price: 50,
        totalTickets: 100,
        availableTickets: 75,
        imageUrl: 'https://source.unsplash.com/random/800x600/?event',
        status: 'approved',
        organizer: {
          _id: '1',
          name: 'Sample Organizer'
        }
      };
      
      setEvent(response);
    } catch (error) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    setBookingError('');
    try {
      // TODO: Implement API call to create booking
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookingDialogOpen(false);
      navigate('/bookings');
    } catch (error) {
      setBookingError('Failed to create booking');
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Event not found</Typography>
      </Container>
    );
  }

  const isOrganizer = currentUser?._id === event.organizer._id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {event.title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={event.status}
                color={
                  event.status === 'approved' ? 'success' :
                  event.status === 'pending' ? 'warning' :
                  'error'
                }
                sx={{ mr: 1 }}
              />
              <Chip label={event.category} variant="outlined" />
            </Box>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {format(new Date(event.date), 'PPP p')}
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
            </Grid>
          </Paper>

          {isOrganizer && (
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/my-events/${id}/edit`)}
                sx={{ mr: 2 }}
              >
                Edit Event
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {/* TODO: Implement delete functionality */}}
              >
                Delete Event
              </Button>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Price per ticket
              </Typography>
              <Typography variant="h5" color="primary">
                ${event.price}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Available tickets
              </Typography>
              <Typography variant="body1">
                {event.availableTickets} of {event.totalTickets}
              </Typography>
            </Box>
            {!isOrganizer && event.status === 'approved' && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => setBookingDialogOpen(true)}
                disabled={event.availableTickets === 0}
              >
                Book Tickets
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)}>
        <DialogTitle>Book Tickets</DialogTitle>
        <DialogContent>
          {bookingError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {bookingError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Number of Tickets"
            type="number"
            fullWidth
            value={ticketCount}
            onChange={(e) => setTicketCount(Math.max(1, Math.min(event.availableTickets, parseInt(e.target.value) || 1)))}
            inputProps={{ min: 1, max: event.availableTickets }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Total: ${(event.price * ticketCount).toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBooking} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;