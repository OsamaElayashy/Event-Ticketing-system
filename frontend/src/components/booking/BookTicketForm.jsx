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

  const availableTickets = event.capacity - event.bookedTickets;
  const totalPrice = event.price * ticketCount;

  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setTicketCount(Math.max(1, Math.min(availableTickets, value)));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await api.post(BOOKING_ENDPOINTS.CREATE_BOOKING, {
        eventId: event._id,
        ticketCount,
        totalPrice
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book tickets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book Tickets</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Event Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(event.date).toLocaleDateString()} at {event.time}
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
          inputProps={{ 
            min: 1, 
            max: availableTickets,
            'aria-label': 'Number of tickets'
          }}
          helperText={`${availableTickets} tickets available`}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Price Details
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Price per ticket
            </Typography>
            <Typography variant="body2">
              ${event.price.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">
              Total
            </Typography>
            <Typography variant="subtitle1" color="primary">
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookTicketForm; 