import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import api from '../../api/api';
import { EVENT_ENDPOINTS } from '../../config/api.config';

const EventList = ({ events: eventsProp, isAdmin, onApprove, onReject }) => {
  const [events, setEvents] = useState(eventsProp || []);
  const [loading, setLoading] = useState(!eventsProp);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventsProp !== undefined) {
      setEvents(eventsProp);
      return;
    }
    const fetchEvents = async () => {
      try {
        const response = await api.get(EVENT_ENDPOINTS.ALL_EVENTS);
        setEvents(response.data);
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [eventsProp]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (events.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="text.secondary">No events found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s ease-in-out' },
              }}
            >
              {event.image && (
                <CardMedia
                  component="img"
                  height="180"
                  image={event.image}
                  alt={event.title}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph noWrap>
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.Date ? format(new Date(event.Date), 'PPP') : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${Number(event.ticketPrice).toFixed(2)}
                  </Typography>
                  <Chip
                    label={event.status}
                    color={event.status === 'approved' ? 'success' : event.status === 'pending' ? 'warning' : 'error'}
                    size="small"
                  />
                </Box>

                {isAdmin && event.status === 'pending' && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button size="small" variant="contained" color="success" onClick={() => onApprove && onApprove(event._id)}>
                      Approve
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => onReject && onReject(event._id)}>
                      Reject
                    </Button>
                  </Box>
                )}

                <Box sx={{ mt: 1 }}>
                  <Link to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">View Details →</Typography>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventList;
