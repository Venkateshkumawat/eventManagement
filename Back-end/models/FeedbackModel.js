const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  event: { type: String },
  givenBy: { type: String},
  role: {
    type: String,
    enum: ['volunteer', 'organizer'],
    required: true
  },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
