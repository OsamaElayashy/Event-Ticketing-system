import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/common/Toast';
import axios from 'axios';

const MyEvents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events/organizer');
      setEvents(response.data);
    } catch (error) {
      showToast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/events/${eventToDelete._id}`);
      showToast.success('Event deleted successfully');
      setEvents(events.filter(event => event._id !== eventToDelete._id));
    } catch (error) {
      showToast.error('Failed to delete event');
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      draft: { color: 'default', label: 'Draft' },
      published: { color: 'success', label: 'Published' },
      cancelled: { color: 'error', label: 'Cancelled' },
      completed: { color: 'info', label: 'Completed' },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Events
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/create-event')}
          >
            Create New Event
          </Button>
        </Box>

        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(event.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {event.location}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {getStatusChip(event.status)}
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(event._id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(event)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {events.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You haven't created any events yet.
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyEvents; 