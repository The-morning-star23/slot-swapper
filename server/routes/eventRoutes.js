import express from 'express';
import {
  createEvent,
  getMyEvents,
  updateEventStatus,
  deleteEvent,
} from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// --- All routes in this file are protected ---
// The authMiddleware will run before any of these routes
router.use(authMiddleware);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', createEvent);

// @route   GET /api/events/my-events
// @desc    Get all of the logged-in user's events
// @access  Private
router.get('/my-events', getMyEvents);

// @route   PUT /api/events/:id/status
// @desc    Update an event's status (e.g., to 'SWAPPABLE')
// @access  Private
router.put('/:id/status', updateEventStatus);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', deleteEvent);

export default router;