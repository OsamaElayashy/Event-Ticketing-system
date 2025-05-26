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
  Chip
} from '@mui/material';

const BookingList = ({ bookings }) => {
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
          <ListItemButton
            component={Link}
            to={`/bookings/${booking._id}`}
            sx={{ p: 2 }}
          >
            <ListItem
              alignItems="flex-start"
              sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" component="div">
                    {booking.event?.title || 'Event Title'}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(booking.date).toLocaleDateString()}
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
            </ListItem>
          </ListItemButton>
        </Paper>
      ))}
    </List>
  );
};

export default BookingList; 