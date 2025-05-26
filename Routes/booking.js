const express = require('express');
const router = express.Router();
const bookingsController = require('../Controllers/bookingController');
const authenticate = require("../Middleware/authenticationMiddleware");

// Standard user actions
// * Book tickets for an event
router.post("/", authenticate, bookingsController.bookTickets);

// * Get booking details by ID
router.get("/:id", authenticate, bookingsController.getBookingDetails);

// * Cancel a booking
router.delete("/:id", authenticate, bookingsController.cancelBooking);

module.exports = router;
