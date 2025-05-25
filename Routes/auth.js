const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

// Login
router.post("/login", userController.login);

// Register
router.post("/register", userController.register);

// Forgot Password
router.post("/forgot-password", userController.forgetPassword);

// Logout (simple cookie clearing)
router.post("/logout", (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router; // ! Don't forget to export the router