const Feedback = require('../models/FeedbackModel');
const asyncHandler = require('express-async-handler');

// Submit feedback for an event
const submitFeedback = asyncHandler(async (req, res) => {
  const { event, rating, comment, role, givenBy } = req.body;

  if (!event || !rating || !role || !givenBy) {
    return res.status(400).json({ message: "Event, GivenBy, Role, and Rating are required" });
  }

  const feedback = await Feedback.create({
    event,
    givenBy,
    role,
    rating,
    comment,
  });

  res.status(201).json({
    message: "Feedback submitted successfully",
    feedback,
  });
});




module.exports = {
    submitFeedback
};
