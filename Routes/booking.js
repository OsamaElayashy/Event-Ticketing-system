const express = require('express');
const router = express.Router();
const bookingsController = require('../Controllers/bookingController');  // Use consistent name
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticate = require("../Middleware/authenticationMiddleware");

// Standard user actions
// * Book tickets for an event
router.post("/", authenticate, authorizationMiddleware(["StandardUser"]), bookingsController.bookTickets);

// * Get booking details by ID
router.get("/:id", authenticate, authorizationMiddleware(["StandardUser"]), bookingsController.getBookingDetails);

// * Cancel a booking
router.delete("/:id", authenticate, authorizationMiddleware(["StandardUser"]), bookingsController.cancelBooking);

module.exports = router;
