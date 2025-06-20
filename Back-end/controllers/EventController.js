const Event = require('../models/EventModel');
const asyncHandler = require('express-async-handler');

// ✅ Create Event
const createEvent = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        location,
        date,
        image,
        itemsToCarry,
    } = req.body;

    if (!title || !date) {
        res.status(400);
        throw new Error('Title and date are required');
    }

    const event = await Event.create({
        title,
        description,
        location,
        date,
        image,
        itemsToCarry: itemsToCarry || [],
        createdBy: req.user.id
    });

    res.status(201).json(event);
});

// ✅ Get All Events
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
});

// ✅ Update Event
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (!event.createdBy || !req.user?.id || event.createdBy.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this event');
    }

    const {
        title,
        description,
        location,
        date,
        image,
        itemsToCarry,

    } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (location) event.location = location;
    if (date) event.date = date;
    if (image) event.image = image;
    if (itemsToCarry) event.itemsToCarry = itemsToCarry;


    const updatedEvent = await event.save();
    res.json(updatedEvent);
});

// ✅ Delete Event
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (!event.createdBy || !req.user?.id || event.createdBy.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this event');
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
});

module.exports = {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent
};
