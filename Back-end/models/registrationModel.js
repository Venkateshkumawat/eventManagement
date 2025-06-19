const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  eventName: { type: String, required: true },
status: {
    type: String,
    enum: ['registered', 'cancelled', 'completed'],
    default: 'registered'
  }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
