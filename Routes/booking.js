const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const authenticate = require("../middleware/authenticationMiddleware");

// Standard user actions
// * Book tickets for an event
router.post("/", authenticate, authorizationMiddleware(["StandardUser"]), bookingController.bookTickets);

// * Get booking details by ID (not implemented in controller, so this line may need to be updated or removed)
// router.get("/:id", authenticate, authorizationMiddleware(["StandardUser"]), bookingController.getBookingDetails);

// * Cancel a booking
router.delete("/:id", authenticate, authorizationMiddleware(["StandardUser"]), bookingController.cancelBooking);

module.exports = router;
