import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid
} from '@mui/material';
import api from '../api/api';
import { BOOKING_ENDPOINTS } from '../config/api.config';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get(BOOKING_ENDPOINTS.USER_BOOKINGS);
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.delete(BOOKING_ENDPOINTS.CANCEL_BOOKING(bookingId));
      toast.success('Booking cancelled');
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
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
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {bookings.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't made any bookings yet.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Browse Events
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {booking.event?.title || 'Event'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.event?.Date ? format(new Date(booking.event.Date), 'PPP') : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.event?.location}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2">Tickets: {booking.tickets}</Typography>
                      <Typography variant="body1" color="primary">
                        Total: ${Number(booking.totalPrice).toFixed(2)}
                      </Typography>
                    </Box>
                    <Chip
                      label={booking.status}
                      color={booking.status === 'confirmed' ? 'success' : booking.status === 'canceled' ? 'error' : 'warning'}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  {booking.status !== 'canceled' && (
                    <Button size="small" color="error" onClick={() => handleCancel(booking._id)}>
                      Cancel Booking
                    </Button>
                  )}
                  <Button size="small" onClick={() => navigate(`/bookings/${booking._id}`)}>
                    View Details
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

export default UserBookingsPage;
