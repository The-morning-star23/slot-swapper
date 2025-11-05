import express from 'express';
import {
  getSwappableSlots,
  requestSwap,
  respondToSwap,
  getMySwapRequests
} from '../controllers/swapController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// --- All routes in this file are protected ---
router.use(authMiddleware);

// @route   GET /api/swaps/swappable-slots
// @desc    Get all slots from other users marked as SWAPPABLE
// @access  Private
router.get('/swappable-slots', getSwappableSlots);

// @route   POST /api/swaps/request
// @desc    Create a new swap request
// @access  Private
router.post('/request', requestSwap);

// @route   POST /api/swaps/response/:requestId
// @desc    Respond to an incoming swap request (Accept/Reject)
// @access  Private
router.post('/response/:requestId', respondToSwap);

// @route   GET /api/swaps/my-requests
// @desc    Get all incoming and outgoing requests for the user
// @access  Private
router.get('/my-requests', getMySwapRequests);

export default router;