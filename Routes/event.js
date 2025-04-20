const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { isAuthenticated } = require('../middleware/auth');

// * Create a new event (Organizer only)
router.post("/", isAuthenticated(["Organizer"]), eventsController.createEvent);

// * Get a list of all approved events (Public)
router.get("/", eventsController.getApprovedEvents);

// * Get a list of all events (Admin only)
router.get("/all", isAuthenticated(["Admin"]), eventsController.getAllEvents);

// * Get details of a single event (Public)
router.get("/:id", eventsController.getEvent);

// * Update an event (Organizer or Admin)
router.put("/:id", isAuthenticated(["Organizer", "Admin"]), eventsController.updateEvent);

// * Delete an event (Organizer or Admin)
router.delete("/:id", isAuthenticated(["Organizer", "Admin"]), eventsController.deleteEvent);

module.exports = router;

