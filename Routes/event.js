const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { isOrganizer, isAdmin } = require('../middleware/auth');


router.get("/events", authorizationMiddleware(["StandardUser" , "Organizer" , "Admin"]),eventsController.getAllEvents);


// Only organizers can post events
router.post("/events", authorizationMiddleware(["Organizer"]), eventsController.createEvent);

// Only organizers can edit event details (number of tickets, date, and location)
router.put("/:id", authorizationMiddleware(["Organizer"]), eventsController.updateEvent);

// Only organizers can delete events
router.delete("/:id", authorizationMiddleware(["Organizer"]), eventsController.deleteEvent);

router.get("/events/analytics", authorizationMiddleware(["Organizer"]),eventsController.getEventAnalytics);

router.put("/:id", authorizationMiddleware(["Admin"]), eventsController.updateEventStatus);


module.exports = router;
