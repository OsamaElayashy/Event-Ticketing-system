const express = require('express');
const router = express.Router();
const bookingsController = require('../Controllers/bookingController');  // Use consistent name
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const authenticate = require("../middleware/authenticationMiddleware");

// Standard user actions
// * Book tickets for an event
router.post("/", isAuthorized(["StandardUser"]), bookingsController.createBooking);

// * Get booking details by ID
router.get("/:id", isAuthorized(["StandardUser"]), bookingsController.getBookingDetails);

// * Cancel a booking
router.delete("/:id", isAuthorized(["StandardUser"]), bookingsController.cancelBooking);

module.exports = router;
