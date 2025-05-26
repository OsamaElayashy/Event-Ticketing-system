import React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const BookingList = ({ bookings, onCancelBooking }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No bookings found
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {bookings.map((booking) => (
        <Paper key={booking._id} elevation={2} sx={{ mb: 2 }}>
          <ListItem sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {booking.event?.title || 'Event Title'}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(booking.event?.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {booking.event?.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tickets: {booking.tickets}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount: ${booking.totalPrice}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: 
                        <Chip
                          label={booking.status}
                          size="small"
                          color={
                            booking.status === 'confirmed' ? 'success' :
                            booking.status === 'pending' ? 'warning' :
                            'error'
                          }
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => onCancelBooking(booking._id)}
                  disabled={booking.status === 'cancelled'}
                >
                  Cancel Booking
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        </Paper>
      ))}
    </List>
  );
};

export default BookingList; 