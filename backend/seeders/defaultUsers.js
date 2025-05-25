const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const seedDefaultUsers = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@eventtick.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@eventtick.com',
        password: await bcrypt.hash('Admin@123', 10),
        role: 'Admin'
      });
      console.log('Default admin account created');
    }

    // Check if organizer already exists
    const organizerExists = await User.findOne({ email: 'organizer@eventtick.com' });
    if (!organizerExists) {
      await User.create({
        name: 'Organizer User',
        email: 'organizer@eventtick.com',
        password: await bcrypt.hash('Organizer@123', 10),
        role: 'Organizer'
      });
      console.log('Default organizer account created');
    }

    // Check if regular user already exists
    const userExists = await User.findOne({ email: 'user@eventtick.com' });
    if (!userExists) {
      await User.create({
        name: 'Regular User',
        email: 'user@eventtick.com',
        password: await bcrypt.hash('User@123', 10),
        role: 'StandardUser'
      });
      console.log('Default user account created');
    }

    console.log('Default users seeding completed');
  } catch (error) {
    console.error('Error seeding default users:', error);
  }
};

module.exports = seedDefaultUsers; 