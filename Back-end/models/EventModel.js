const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  activities: String,
  location: String,
  date: Date,
 image: {
  type: String,
  default: ''
}
,
itemsToCarry: {
    type: [String],
    default: []
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  // Organizer
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
