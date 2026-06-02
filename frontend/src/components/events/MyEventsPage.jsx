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
import api from '../../api/api';
import { EVENT_ENDPOINTS } from '../../config/api.config';
import { toast } from 'react-toastify';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get(EVENT_ENDPOINTS.MY_EVENTS);
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(EVENT_ENDPOINTS.DELETE_EVENT(eventId));
      toast.success('Event deleted');
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      toast.error('Failed to delete event');
    }
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
        <Typography variant="h4" component="h1">My Events</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/my-events/new')}>
          + Create New Event
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {events.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't created any events yet.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/my-events/new')}>
            Create Your First Event
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} key={event._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>{event.title}</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={event.status}
                      color={event.status === 'approved' ? 'success' : event.status === 'pending' ? 'warning' : 'error'}
                      sx={{ mr: 1 }}
                    />
                    <Chip label={event.category} variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Date</Typography>
                      <Typography variant="body1">
                        {event.Date ? format(new Date(event.Date), 'PPP') : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="body1">{event.location}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Tickets Sold</Typography>
                      <Typography variant="body1">
                        {event.totaltickets - event.remainingTickets} / {event.totaltickets}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Price</Typography>
                      <Typography variant="body1">${Number(event.ticketPrice).toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/my-events/${event._id}/edit`)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(event._id)}>
                    Delete
                  </Button>
                  <Button size="small" onClick={() => navigate(`/events/${event._id}`)}>
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyEventsPage;
