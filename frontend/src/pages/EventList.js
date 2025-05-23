import React from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const navigate = useNavigate();

  // Temporary mock data
  const events = [
    {
      id: 1,
      title: 'Summer Music Festival',
      date: '2024-07-15',
      location: 'Central Park',
      image: 'https://source.unsplash.com/random/800x600/?concert',
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      date: '2024-08-20',
      location: 'Convention Center',
      image: 'https://source.unsplash.com/random/800x600/?conference',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Upcoming Events
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/create-event')}
        >
          Create Event
        </Button>
      </Box>

      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={event.image}
                alt={event.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {event.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {event.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventList; 