const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./DB')
const port = process.env.PORT
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
  origin: 'http://localhost:5173',
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






app.get('/', (req, res) => {
  res.send('Hello World!');
});








// Start the server
app.listen(port, () => {
  console.log('Server is running');
});