import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Paper } from '@mui/material';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch booking details from API
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Booking not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Booking Details
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* TODO: Add booking details */}
        <Typography>Booking ID: {id}</Typography>
      </Paper>
    </Container>
  );
};

export default BookingDetails; 