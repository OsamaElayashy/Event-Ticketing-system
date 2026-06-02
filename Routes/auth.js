const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const userModel = require("../models/userModel");

// Login
router.post("/login", userController.login);

// Register
router.post("/register", userController.register);

// Forgot Password
router.post("/forgot-password", userController.forgetPassword);

// Verify reset token
router.get("/verify-reset/:token", userController.verifyResetCode);

// Reset password
router.post("/reset-password/:token", userController.resetPassword);

// Check session (used by frontend on page load)
router.get("/check-session", authenticationMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select('-password');
    if (!user) return res.status(401).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Logout (simple cookie clearing)
router.post("/logout", (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: process.env.NODE_ENV === 'production' });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;