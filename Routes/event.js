const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { isOrganizer, isAdmin } = require('../middleware/auth');

// Anyone can view
router.get('/', eventsController.getAllEvents);

// Organizer routes
router.post('/', isOrganizer, eventsController.createEvent);
router.put('/:id', isOrganizer, eventsController.updateEvent);
router.delete('/:id', isOrganizer, eventsController.deleteEvent);
router.get('/analytics', isOrganizer, eventsController.getEventAnalytics);

// Admin routes
router.patch('/:id/status', isAdmin, eventsController.updateEventStatus);

module.exports = router;
