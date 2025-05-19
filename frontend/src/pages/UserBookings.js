import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/common/Toast';
import axios from 'axios';

const UserBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/user');
      setBookings(response.data);
    } catch (error) {
      showToast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await axios.post(`/api/bookings/${bookingToCancel._id}/cancel`);
      showToast.success('Booking cancelled successfully');
      setBookings(bookings.map(booking => 
        booking._id === bookingToCancel._id 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (error) {
      showToast.error('Failed to cancel booking');
    } finally {
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      confirmed: { color: 'success', label: 'Confirmed' },
      cancelled: { color: 'error', label: 'Cancelled' },
      pending: { color: 'warning', label: 'Pending' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>

        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {booking.event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date: {new Date(booking.event.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Location: {booking.event.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tickets: {booking.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total: ${booking.totalAmount}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {getStatusChip(booking.status)}
                  </Box>
                </CardContent>
                <CardActions>
                  {booking.status === 'confirmed' && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleCancelClick(booking)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  <Button
                    size="small"
                    onClick={() => navigate(`/event/${booking.event._id}`)}
                  >
                    View Event
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {bookings.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You haven't made any bookings yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/events')}
              sx={{ mt: 2 }}
            >
              Browse Events
            </Button>
          </Box>
        )}
      </Box>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your booking for "{bookingToCancel?.event.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Booking</Button>
          <Button onClick={handleCancelConfirm} color="error">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserBookings; 