const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to Event model
    required: true,
  },
  tickets: {
    type: Number,
    required: true,
    min: 1, // Ensure at least one ticket is booked
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0, // Ensure price isn't negative
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
