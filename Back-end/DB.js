const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const connectDB = asyncHandler(async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL, {
    
  });

  console.log(`MongoDB Connected`);
});

module.exports = connectDB;