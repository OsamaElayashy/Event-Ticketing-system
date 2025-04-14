const express = require("express");
const userController = require("../Controllers/userController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware');
const router = express.Router();

// * Get all users
router.get("/", authorizationMiddleware(['student','admin']),userController.getAllUsers);



// * Get current user
router.get('/current', authorizationMiddleware(['admin','student']), userController.getCurrentUser);

// * Get a user by id
// Place after "/current" so that "current" is not treated as an id
router.get("/:id", authorizationMiddleware(['admin']), userController.getUser);

// * Update a user

router.put("/:id",authorizationMiddleware(['admin','student']),userController.updateUser);

// * Delete a user
router.delete("/:id",authorizationMiddleware(['admin']),userController.deleteUser);

module.exports = router; // ! Don't forget to export the router
