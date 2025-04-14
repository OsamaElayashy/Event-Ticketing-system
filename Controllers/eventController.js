const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
  const events = await Event.find({ status: 'approved' });
  res.json(events);
};

exports.createEvent = async (req, res) => {
  const { name, tickets, date, location } = req.body;
  const event = new Event({
    name,
    tickets,
    date,
    location,
    organizer: req.user.id,
    status: 'pending',
  });
  await event.save();
  res.status(201).json(event);
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
  if (!event) return res.status(404).json({ message: 'Event not found or unauthorized' });

  Object.assign(event, req.body);
  await event.save();
  res.json(event);
};

exports.deleteEvent = async (req, res) => {
  const event = await Event.findOneAndDelete({ _id: req.params.id, organizer: req.user.id });
  if (!event) return res.status(404).json({ message: 'Event not found or unauthorized' });

  res.json({ message: 'Event deleted' });
};

exports.getEventAnalytics = async (req, res) => {
  const events = await Event.find({ organizer: req.user.id });
  const analytics = events.map(event => ({
    name: event.name,
    percentageBooked: (event.ticketsBooked / event.tickets) * 100
  }));
  res.json(analytics);
};

exports.updateEventStatus = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  event.status = req.body.status; // approved, pending, declined
  await event.save();
  res.json(event);
};
