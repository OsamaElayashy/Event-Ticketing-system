import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Alert,
  Button,
  Chip,
  Divider
} from '@mui/material';
import api from '../../api/api';
import { BOOKING_ENDPOINTS } from '../../config/api.config';
import { format } from 'date-fns';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(BOOKING_ENDPOINTS.BOOKING_BY_ID(id));
        setBooking(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Booking not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/bookings')}>Back to Bookings</Button>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5">Booking not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/bookings')}>Back to Bookings</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Booking Details
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">{booking.event?.title || 'Event'}</Typography>
          <Chip
            label={booking.status}
            color={booking.status === 'confirmed' ? 'success' : booking.status === 'canceled' ? 'error' : 'warning'}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Date</Typography>
            <Typography>
              {booking.event?.Date ? format(new Date(booking.event.Date), 'PPP') : 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Location</Typography>
            <Typography>{booking.event?.location || 'N/A'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Tickets</Typography>
            <Typography>{booking.tickets}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Total Paid</Typography>
            <Typography color="primary" fontWeight="bold">
              ${Number(booking.totalPrice).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Booked On</Typography>
            <Typography>{format(new Date(booking.createdAt), 'PPP')}</Typography>
          </Box>
        </Box>
      </Paper>
      <Button sx={{ mt: 2 }} onClick={() => navigate('/bookings')}>
        ← Back to My Bookings
      </Button>
    </Container>
  );
};

export default BookingDetails;
