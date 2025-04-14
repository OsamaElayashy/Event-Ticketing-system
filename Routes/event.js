const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { isOrganizer, isAdmin } = require('../middleware/auth');


router.get("/", authorizationMiddleware(["StandardUser" , "Organizer" , "Admin"]),eventController.getAllEvents);

// Only organizers can post events
router.post("/", authorizationMiddleware(["Organizer"]), eventController.createEvent);

// Only organizers can edit event details (number of tickets, date, and location)
router.put("/:id", authorizationMiddleware(["Organizer"]), eventController.updateEvent);

// Only organizers can delete events
router.delete("/:id", authorizationMiddleware(["Organizer"]), eventController.deleteEvent);

router.get("/:id", authorizationMiddleware(["Organizer"]),eventController.getEventAnalytics);

router.put("/:id", authorizationMiddleware(["Admin"]), eventController.updateEventStatus);


module.exports = router;
