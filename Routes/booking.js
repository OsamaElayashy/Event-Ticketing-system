const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');  // Use consistent name
const { isAuthenticated } = require('../middleware/auth');  // Use correct middleware

// Standard user actions
// * Book tickets for an event
router.post("/", isAuthenticated(["StandardUser"]), bookingsController.createBooking);

// * Get booking details by ID
router.get("/:id", isAuthenticated(["StandardUser"]), bookingsController.getBookingDetails);

// * Cancel a booking
router.delete("/:id", isAuthenticated(["StandardUser"]), bookingsController.cancelBooking);

module.exports = router;
