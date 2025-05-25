const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

// * login
router.post("/login", userController.login);
// * register
router.post("/register", userController.register);

// Logout
router.post("/logout", userController.logout);

// Forgot Password
router.post("/forgot-password", userController.forgotPassword);

module.exports = router; // ! Don't forget to export the router