const eventModel = require("../models/EventModel");

const eventController = {
  createEvent: async (req, res) => {
    try {
      const {
        title,
        description,
        Date,
        location,
        category,
        image,
        ticketPrice,
        totaltickets,
      } = req.body;

      const newEvent = new eventModel({
        title,
        description,
        Date,
        location,
        category,
        image,
        ticketPrice,
        totaltickets,
        remainingTickets: totaltickets,
        Organizer: req.user.userId,
        status: "pending",
      });

      await newEvent.save();

      res.status(201).json({ message: "Event created successfully", newEvent });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getApprovedEvents: async (req, res) => {
    try {
      const events = await eventModel.find({ status: "approved" });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllEvents: async (req, res) => {
    try {
      const events = await eventModel.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getEvent: async (req, res) => {
    try {
      const event = await eventModel.findById(req.params.id);
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const updated = await eventModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({ message: "Event updated successfully", updated });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const event = await eventModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Event deleted successfully", event });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserEvents: async (req, res) => {
    try {
      const events = await eventModel.find({ Organizer: req.user.userId });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = eventController;