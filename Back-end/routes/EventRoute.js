const express = require('express');
const router = express.Router();
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/EventController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createEvent);
router.get('/', getEvents);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;
