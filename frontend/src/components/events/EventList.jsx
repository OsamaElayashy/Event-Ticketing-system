import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  CircularProgress,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'all',
    'Music',
    'Sports',
    'Arts',
    'Food',
    'Technology',
    'Business',
    'Other'
  ];

  useEffect(() => {
    fetchEvents();
  }, [page, category, searchTerm]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to fetch events
      // Simulated API response
      const response = {
        events: [
          {
            _id: '1',
            title: 'Sample Event',
            description: 'This is a sample event description',
            date: new Date(),
            location: 'Sample Location',
            category: 'Music',
            price: 50,
            imageUrl: 'https://source.unsplash.com/random/800x600/?event',
            status: 'approved'
          }
        ],
        totalPages: 1
      };
      
      setEvents(response.events);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              value={category}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              component={Link}
              to={`/events/${event._id}`}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={event.imageUrl}
                alt={event.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(event.date), 'PPP p')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      ${event.price}
                    </Typography>
                    <Chip
                      label={event.status}
                      color={
                        event.status === 'approved' ? 'success' :
                        event.status === 'pending' ? 'warning' :
                        'error'
                      }
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default EventList;