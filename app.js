const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Routes
const authRouter = require('./Routes/auth.js');
const userRouter = require('./Routes/user.js');
const eventsRouter = require('./Routes/event.js');
const bookingsRouter = require('./Routes/booking.js');

// Public routes (no authentication required)
app.use('/api/auth', authRouter);

// Protected routes (require authentication)
const authenticationMiddleware = require('./Middleware/authenticationMiddleware.js');
app.use('/api/users', authenticationMiddleware, userRouter);
app.use('/api/events', authenticationMiddleware, eventsRouter);
app.use('/api/bookings', authenticationMiddleware, bookingsRouter);

// Database connection
const db_name = process.env.DB_NAME;
const db_url = `${process.env.DB_URL}/${db_name}`;

mongoose
  .connect(db_url)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
