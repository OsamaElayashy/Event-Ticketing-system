const Booking = require('../models/bookingModel');
const Event = require('../models/EventModel');

exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.userId });
  res.json(bookings);
};

// bookTickets
exports.bookTickets = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const event = await Event.findById(eventId);

    if (!event || event.status !== 'approved') {
      return res.status(404).json({ message: 'Event not found or not approved' });
    }

    if (event.remainingTickets < quantity) {
      return res.status(400).json({ message: 'Not enough remaining tickets' });
    }

    const totalPrice = event.ticketPrice * quantity;

    const booking = new Booking({
      user: req.user.userId,
      event: eventId,
      tickets: quantity,
      totalPrice,
    });

    await booking.save();

    event.remainingTickets -= quantity;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const event = await Event.findById(booking.event);
    if (event) {
      event.remainingTickets += booking.tickets;
      await event.save();
    }

    await booking.deleteOne();
    res.json({ message: 'Booking canceled and tickets updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = bookingController;
