import React from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Event Ticketing
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover and book tickets for amazing events in your area
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Browse Events
        </Button>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Events
        </Typography>
        <Grid container spacing={4}>
          {/* Featured events will be added here */}
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              Loading featured events...
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 