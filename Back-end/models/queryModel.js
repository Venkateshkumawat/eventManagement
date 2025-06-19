const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    query: {
      type: String,
      required: [true, 'Query text is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);
