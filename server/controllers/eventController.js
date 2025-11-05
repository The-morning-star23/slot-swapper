import Event from '../models/Event.js';
import mongoose from 'mongoose';

// --- Create a new event ---
export const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;

    const newEvent = new Event({
      title,
      startTime,
      endTime,
      status: 'BUSY', // All new events start as 'BUSY'
      owner: req.user.id, // 'req.user.id' comes from our authMiddleware
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- Get all events for the logged-in user ---
export const getMyEvents = async (req, res) => {
  try {
    // Find events where the owner matches the logged-in user's ID
    const events = await Event.find({ owner: req.user.id }).sort({
      startTime: 'asc',
    }); // Sort by start time
    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- Update an event's status ---
// (e.g., from 'BUSY' to 'SWAPPABLE')
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const eventId = req.params.id;

    // Check for valid status
    if (!['BUSY', 'SWAPPABLE'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status update' });
    }
    
    // Check for valid event ID
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(404).json({ msg: 'Event not found' });
    }

    let event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // --- SECURITY CHECK ---
    // Make sure the logged-in user is the owner of the event
    if (event.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // We don't allow changing status if a swap is already pending
    if (event.status === 'SWAP_PENDING') {
        return res.status(400).json({ msg: 'Cannot change status of a pending swap' });
    }

    event.status = status;
    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- Delete an event ---
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check for valid event ID
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(404).json({ msg: 'Event not found' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // --- SECURITY CHECK ---
    // Make sure the logged-in user is the owner
    if (event.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Prevent deletion if a swap is pending
    if (event.status === 'SWAP_PENDING') {
        return res.status(400).json({ msg: 'Cannot delete event with a pending swap' });
    }

    await Event.findByIdAndDelete(eventId);
    res.json({ msg: 'Event removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};