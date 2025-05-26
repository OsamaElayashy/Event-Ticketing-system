import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to fetch organizer's events
      // Simulated API response
      const response = [
        {
          _id: '1',
          title: 'Sample Event',
          description: 'This is a sample event description',
          date: new Date(),
          location: 'Sample Location',
          category: 'Music',
          price: 50,
          totalTickets: 100,
          availableTickets: 75,
          status: 'approved',
          bookings: [
            { date: new Date(), tickets: 2 },
            { date: new Date(), tickets: 1 }
          ]
        }
      ];
      
      setEvents(response);
    } catch (error) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // TODO: Implement API call to delete event
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(events.filter(event => event._id !== eventId));
      } catch (error) {
        setError('Failed to delete event');
      }
    }
  };

  const calculateBookingPercentage = (event) => {
    const totalBooked = event.totalTickets - event.availableTickets;
    return (totalBooked / event.totalTickets) * 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          My Events
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/my-events/new')}
        >
          Create New Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
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
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(event.date), 'PPP')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {event.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Tickets Sold
                    </Typography>
                    <Typography variant="body1">
                      {event.totalTickets - event.availableTickets} / {event.totalTickets}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Booking Rate
                    </Typography>
                    <Typography variant="body1">
                      {calculateBookingPercentage(event).toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/my-events/${event._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate(`/my-events/${event._id}/analytics`)}
                >
                  View Analytics
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyEventsPage;