import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import BookingList from '../components/booking/BookingList';

const UserBookingsPage = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user bookings from API
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>
      <BookingList bookings={bookings} />
    </Container>
  );
};

export default UserBookingsPage; 