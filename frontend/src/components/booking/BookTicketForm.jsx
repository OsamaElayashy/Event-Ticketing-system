import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import api from '../../api/api';
import { BOOKING_ENDPOINTS } from '../../config/api.config';

const BookTicketForm = ({ event, onClose, onSuccess }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const availableTickets = event.remainingTickets ?? 0;
  const pricePerTicket = Number(event.ticketPrice) || 0;
  const totalPrice = pricePerTicket * ticketCount;

  const handleChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    value = Math.max(1, Math.min(availableTickets, value));
    setTicketCount(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(BOOKING_ENDPOINTS.CREATE_BOOKING, {
        eventId: event._id,
        quantity: ticketCount,
        totalPrice
      });
      setBookingSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to book tickets');
      } else {
        setError(err.response?.data?.message || 'Failed to book tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open maxWidth="sm" fullWidth onClose={onClose}>
      {loading && (
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 1
        }}>
          <CircularProgress />
        </Box>
      )}

      <DialogTitle>Book Tickets</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {bookingSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Booking confirmed!
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Event</Typography>
          <Typography variant="body2" color="text.secondary">{event.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(event.Date).toLocaleDateString()}
          </Typography>
        </Box>

        <TextField
          autoFocus
          margin="dense"
          label="Number of Tickets"
          type="number"
          fullWidth
          value={ticketCount}
          onChange={handleChange}
          inputProps={{ min: 1, max: availableTickets }}
          helperText={`${availableTickets} tickets available`}
          disabled={bookingSuccess}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Price Details</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Price per ticket</Typography>
            <Typography variant="body2">${pricePerTicket.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">Total</Typography>
            <Typography variant="subtitle1" color="primary">${totalPrice.toFixed(2)}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {bookingSuccess ? (
          <Button onClick={onClose} variant="contained">Close</Button>
        ) : (
          <>
            <Button onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={loading || availableTickets === 0}>
              {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookTicketForm;
