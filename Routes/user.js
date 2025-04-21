const express = require("express");
const userController = require("../Controllers/userController");

const router = express.Router();
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const authenticate = require("../middleware/authenticationMiddleware");
// * Register a new user
router.post("/register", userController.register);

// * Login and authenticate user, returning a token
router.post("/login", userController.login);

// * Update user password (public)
router.put("/forgetPassword", userController.forgetPassword);

// * Get all users
router.get("/", authorizationMiddleware(["Admin"]),userController.getAllUsers);

// * Get current user
router.get('/current', authorizationMiddleware(["StandardUser" , "Organizer" , "Admin"]), userController.getCurrentUser);

// * Get a single user by ID (Admin only)
router.get("/:id", authorizationMiddleware(['Admin']), userController.getUser);

// * Update a current user
router.put("/:id",authorizationMiddleware(["StandardUser" , "Organizer" , "Admin"]),userController.updateUser);

// * Update a user's role (Admin only)
router.put("/:id/new", authorizationMiddleware(["Admin"]), userController.updateUser);

// * Delete a user
router.delete("/:id",authorizationMiddleware(["Admin"]),userController.deleteUser);

// * Get current user's bookings 
router.get("/bookings", authorizationMiddleware(["StandardUser"]), userController.getUserBookings);

// * Get current user's events 
router.get("/events", authorizationMiddleware(["Organizer"]), userController.getUserEvents);

// * Get current user's event analytics 
router.get("/events/analytics", authorizationMiddleware(["Organizer"]), userController.getUserEventAnalytics);


module.exports = router; 
