const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./DB');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoutes');
const feedbackRoute = require('./routes/feedbackRoute');
const eventRoute = require('./routes/eventRoute');
const registrationRoute = require('./routes/registrationRoute');
const queryRoute = require('./routes/queryRoutes');

// Connect to DB
connectDB();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // You can add Vercel frontend URL here for production
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/event', eventRoute);
app.use('/api/registration', registrationRoute);
app.use('/api/query', queryRoute);

// Root route
app.get('/', (req, res) => {
  res.send('Hello from Vercel backend!');
});

// ✅ DO NOT use app.listen for Vercel
module.exports = app;
