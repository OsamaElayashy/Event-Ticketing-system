const express = require('express');
const router = express.Router();
const eventsController = require('../Controllers/eventController');
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticate = require("../Middleware/authenticationMiddleware");

// * Create a new event (Organizer only)
router.post("/", authenticate, authorizationMiddleware(["Organizer"]), eventsController.createEvent);

// * Get user's events (Organizer only)
router.get("/my-events", authenticate, authorizationMiddleware(["Organizer"]), eventsController.getUserEvents);

// * Get a list of all approved events (Public)
router.get("/", eventsController.getApprovedEvents);

// * Get a list of all events (Admin only)
router.get("/all", authenticate, authorizationMiddleware(["Admin"]), eventsController.getAllEvents);

// * Get details of a single event (Public)
router.get("/:id", eventsController.getEvent);

// * Update an event (Organizer or Admin)
router.put("/:id", authenticate, authorizationMiddleware(["Organizer", "Admin"]), eventsController.updateEvent);

// * Delete an event (Organizer or Admin)
router.delete("/:id", authenticate, authorizationMiddleware(["Organizer", "Admin"]), eventsController.deleteEvent);

module.exports = router;


// const authorizationMiddleware = require("../middleware/authorizationMiddleware");
// const authenticate = require("../middleware/authenticationMiddleware");