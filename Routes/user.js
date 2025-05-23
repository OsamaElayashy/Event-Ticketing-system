const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticate = require("../Middleware/authenticationMiddleware");

// * Register a new user
router.post("/register", userController.register);

// * Login and authenticate user, returning a token
router.post("/login", userController.login);

// * Update user password (public)
router.put("/forgetPassword", userController.forgetPassword);

// * Get all users (Admin only)
router.get("/", authenticate, authorizationMiddleware(["Admin"]), userController.getAllUsers);

// * Get current user
router.get('/current', authenticate, authorizationMiddleware(["StandardUser", "Organizer", "Admin"]), userController.getCurrentUser);

// * Get a single user by ID (Admin only)
router.get("/:id", authenticate, authorizationMiddleware(['Admin']), userController.getUser);

// * Update a user (Admin only)
router.put("/:id", authenticate, authorizationMiddleware(["Admin"]), userController.updateUser);

// * Update current user
router.put("/me", authenticate, authorizationMiddleware(["StandardUser", "Organizer", "Admin"]), userController.updateCurrentUser);

// * Delete a user (Admin only)
router.delete("/:id", authenticate, authorizationMiddleware(["Admin"]), userController.deleteUser);

// * Get current user's bookings (StandardUser only)
router.get("/bookings", authenticate, authorizationMiddleware(["StandardUser"]), userController.getUserBookings);

// * Get current user's events (Organizer only)
router.get("/events", authenticate, authorizationMiddleware(["Organizer"]), userController.getUserEvents);

// * Get current user's event analytics (Organizer only)
router.get("/events/analytics", authenticate, authorizationMiddleware(["Organizer"]), userController.getUserEventAnalytics);

module.exports = router; 
