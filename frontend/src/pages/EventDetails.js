import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';

const EventDetails = () => {
  const { id } = useParams();

  // Temporary mock data
  const event = {
    id: id,
    title: 'Summer Music Festival',
    date: '2024-07-15',
    time: '18:00',
    location: 'Central Park',
    description: 'Join us for an unforgettable evening of music and entertainment at the annual Summer Music Festival. Featuring top artists from around the world, food vendors, and amazing atmosphere.',
    image: 'https://source.unsplash.com/random/1200x800/?concert',
    price: 49.99,
    availableTickets: 100,
  };

  const handleBookTicket = () => {
    // TODO: Implement ticket booking logic
    console.log('Booking ticket for event:', event.id);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <img
              src={event.image}
              alt={event.title}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <Typography variant="h4" component="h1" sx={{ mt: 3 }}>
              {event.title}
            </Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Date: {event.date}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Time: {event.time}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Location: {event.location}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Ticket Information
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              ${event.price}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {event.availableTickets} tickets remaining
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleBookTicket}
              sx={{ mt: 2 }}
            >
              Book Ticket
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetails; 