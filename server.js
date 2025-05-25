require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;


const User = require('./models/userModel');
const Event = require('./models/eventModel');
const Booking = require('./models/bookingModel');

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
