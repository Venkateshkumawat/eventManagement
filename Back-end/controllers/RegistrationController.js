const Registration = require('../models/registrationModel');
const asyncHandler = require('express-async-handler');

// Register for an event
const registerForEvent = asyncHandler(async (req, res) => {
  const { name, email, contact, eventName, status } = req.body;

  if (!name || !email || !contact || !eventName) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const registration = await Registration.create({
    name,
    email,
    contact,
    eventName,
    status: status || 'registered'
  });

  res.status(201).json({
    message: `You have successfully registered for the event: ${eventName}`,
    registration
  });
});


// Get all registrations (admin or staff access)
const getAllRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find();
  res.json(registrations);
});

// Cancel a registration
const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }

  registration.status = 'cancelled';
  const updated = await registration.save();
  res.json(updated);
});

module.exports = {
  registerForEvent,
  getAllRegistrations,
  cancelRegistration
};
