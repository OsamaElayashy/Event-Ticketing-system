const userModel = require("../Models/userModel");
const bookingModel = require("../Models/bookingModel");
const eventModel = require("../Models/eventModel");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const userController = {
  register: async (req, res) => {
    try {
      console.log('Registration request body:', req.body);
      const { name, email, password, role } = req.body;

      // Validate required fields
      if (!name || !email || !password || !role) {
        console.log('Missing required fields:', { name, email, password, role });
        return res.status(400).json({ 
          message: "All fields are required",
          missing: Object.entries({ name, email, password, role })
            .filter(([_, value]) => !value)
            .map(([key]) => key)
        });
      }

      // Check if the user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        role
      });

      // Save the user to the database
      await newUser.save();
      console.log('New user created:', { name, email, role });

      res.status(201).json({ 
        message: "User registered successfully",
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ 
        message: "Server error during registration",
        error: error.message 
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "email not found" });
      }

      console.log("password: ", user.password);
      // Check if the password is correct

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(405).json({ message: "incorect password" });
      }

      const currentDateTime = new Date();
      const expiresIn = 3 * 60 * 60; // 3 hours
      const expiresAt = new Date(Date.now() + expiresIn * 1000); // JWT expiry time
      // Generate a JWT token
      const token = jwt.sign(
        { user: { userId: user._id, role: user.role } },
        secretKey,
        {
          expiresIn: 3 * 60 * 60,
        }
      );

      
        res.cookie("token", token, {
          expires: expiresAt,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use HTTPS only in production
          sameSite: "none",
        })
        return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.find();
      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const userToUpdate = await userModel.findById(req.params.id);
      if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (req.user.userId !== userToUpdate.id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'You are not authorized to update this user' });
      }
  
      const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(200).json({ user: updatedUser, msg: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  
  deleteUser: async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({ user, msg: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUserBookings: async (req, res) => {
    try {
      const bookings = await bookingModel.find({ user: req.user.userId }).populate('event');
      if (!bookings) {
        return res.status(404).json({ message: "No bookings found" });
      }
      return res.status(200).json(bookings);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUserEvents: async (req, res) => {
    try {
      const events = await eventModel.find({ organizer: req.user.userId });
      if (!events) {
        return res.status(404).json({ message: "No events found" });
      }
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUserEventAnalytics: async (req, res) => {
    try {
      const events = await eventModel.find({ organizer: req.user.userId });
      if (events.length === 0) {
        return res.status(404).json({ message: "No events found" });
      }

      const analytics = await Promise.all(
        events.map(async (event) => {
          const bookings = await bookingModel.find({ event: event._id });
          return {
            title: event.title,
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce(
              (sum, booking) => sum + (booking.totalAmount || 0),
              0
            ),
            remainingTickets: event.remainingTickets,
          };
        })
      );

      return res.status(200).json(analytics);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateCurrentUser: async (req, res) => {
    try {
      const { name, phone, bio, organizationName, organizationType, website } = req.body;
      const updateData = {
        name,
        phone,
        bio,
        ...(req.user.role === 'Organizer' && {
          organizationName,
          organizationType,
          website
        })
      };

      const user = await userModel.findByIdAndUpdate(
        req.user.userId,
        updateData,
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  forgetPassword: async (req, res) => {
    // Placeholder implementation
    return res.status(501).json({ message: 'Not implemented yet.' });
  },
  getAdminStats: async (req, res) => {
    try {
      const [users, events, bookings] = await Promise.all([
        userModel.countDocuments(),
        eventModel.find(),
        bookingModel.countDocuments()
      ]);

      const pendingEvents = events.filter(event => event.status === 'pending').length;
      const totalEvents = events.length;

      return res.status(200).json({
        totalUsers: users,
        totalEvents,
        pendingEvents,
        totalBookings: bookings
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getOrganizerStats: async (req, res) => {
    try {
      const events = await eventModel.find({ organizer: req.user.userId });
      const activeEvents = events.filter(event => 
        new Date(event.date) >= new Date() && event.status === 'approved'
      ).length;

      const bookings = await bookingModel.find({
        event: { $in: events.map(event => event._id) }
      });

      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

      return res.status(200).json({
        totalEvents: events.length,
        activeEvents,
        totalTicketsSold: bookings.length,
        totalRevenue
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUserStats: async (req, res) => {
    try {
      const bookings = await bookingModel
        .find({ user: req.user.userId })
        .populate('event');

      const now = new Date();
      const eventsAttended = bookings.filter(booking => 
        booking.event && new Date(booking.event.date) < now
      ).length;

      const upcomingEvents = bookings.filter(booking => 
        booking.event && new Date(booking.event.date) >= now
      ).length;

      const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

      return res.status(200).json({
        eventsAttended,
        upcomingEvents,
        totalBookings: bookings.length,
        totalSpent
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;
