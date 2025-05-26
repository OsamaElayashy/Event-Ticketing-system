const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticate = require("../Middleware/authenticationMiddleware");

// Public routes
router.post("/register", userController.register);
router.post("/forgot-password", userController.forgetPassword);
router.get("/verify-reset-code/:token", userController.verifyResetCode);
router.post("/reset-password/:token", userController.resetPassword);

// Protected routes
// Get current user profile
router.get("/current", authenticate, userController.getCurrentUser);

// Update current user profile
router.put("/me", authenticate, userController.updateCurrentUser);

// Get user stats based on role
router.get("/stats/admin", authenticate, authorizationMiddleware(["Admin"]), userController.getAdminStats);
router.get("/stats/organizer", authenticate, authorizationMiddleware(["Organizer"]), userController.getOrganizerStats);
router.get("/stats/user", authenticate, authorizationMiddleware(["User"]), userController.getUserStats);

// Admin only routes
router.get("/", authenticate, authorizationMiddleware(["Admin"]), userController.getAllUsers);
router.get("/:id", authenticate, authorizationMiddleware(["Admin"]), userController.getUser);
router.put("/:id", authenticate, authorizationMiddleware(["Admin"]), userController.updateUser);
router.delete("/:id", authenticate, authorizationMiddleware(["Admin"]), userController.deleteUser);

// User bookings and events routes
router.get("/bookings", authenticate, authorizationMiddleware(["User"]), userController.getUserBookings);
router.get("/events", authenticate, authorizationMiddleware(["Organizer"]), userController.getUserEvents);
router.get("/events/analytics", authenticate, authorizationMiddleware(["Organizer"]), userController.getUserEventAnalytics);

module.exports = router; 
