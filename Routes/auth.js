const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

// * login
router.post("/login",userController.login );
// * register
router.post("/register",userController.register);

import api from './index';

export const logout = () => api.post('/logout');
export const forgotPassword = (email) => api.post('/forgot-password', { email });

module.exports = router; // ! Don't forget to export the router