const express = require('express');
const router = express.Router();
const { submitFeedback} = require('../controllers/FeedbackController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', submitFeedback);


module.exports = router;
