const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const { isAuthenticated } = require('../middleware/auth');

// Standard user actions
router.get('/', isAuthenticated, bookingsController.getUserBookings);
router.post('/', isAuthenticated, bookingsController.bookTickets);
router.delete('/:id', isAuthenticated, bookingsController.cancelBooking);

module.exports = router;
