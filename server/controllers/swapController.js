import Event from '../models/Event.js';
import SwapRequest from '../models/SwapRequest.js';
import mongoose from 'mongoose';

// --- Get all swappable slots from OTHER users ---
export const getSwappableSlots = async (req, res) => {
  try {
    // Find events that are SWAPPABLE and do NOT belong to the logged-in user
    const slots = await Event.find({
      status: 'SWAPPABLE',
      owner: { $ne: req.user.id }, // $ne means "not equal"
    })
      .populate('owner', 'name email') // Populate owner info (name and email only)
      .sort({ startTime: 'asc' });

    res.json(slots);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- Create a new swap request ---
export const requestSwap = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;

  try {
    // 1. Validate the slots
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ msg: 'One or both slots not found' });
    }

    // 2. Check ownership and status
    if (mySlot.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Cannot offer a slot you do not own' });
    }
    if (theirSlot.owner.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot swap with yourself' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ msg: 'Both slots must be "SWAPPABLE"' });
    }

    // 3. Create the SwapRequest
    const newSwapRequest = new SwapRequest({
      offeredSlot: mySlotId,
      fromUser: req.user.id,
      desiredSlot: theirSlotId,
      toUser: theirSlot.owner,
      status: 'PENDING',
    });

    // 4. Update both slots to 'SWAP_PENDING'
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';

    // 5. Save all changes
    await newSwapRequest.save();
    await mySlot.save();
    await theirSlot.save();

    res.status(201).json(newSwapRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- Respond to an incoming swap request (Accept / Reject) ---
export const respondToSwap = async (req, res) => {
  const { requestId } = req.params;
  const { accept } = req.body; // accept is a boolean: true or false

  try {
    const swapRequest = await SwapRequest.findById(requestId);

    if (!swapRequest) {
      return res.status(404).json({ msg: 'Swap request not found' });
    }

    // 1. Security Check: Only the recipient (toUser) can respond
    if (swapRequest.toUser.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to respond' });
    }

    // 2. Check if already responded
    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({ msg: 'This request has already been handled' });
    }

    // 3. Get the two events
    const offeredSlot = await Event.findById(swapRequest.offeredSlot);
    const desiredSlot = await Event.findById(swapRequest.desiredSlot);

    if (!offeredSlot || !desiredSlot) {
      return res.status(404).json({ msg: 'One or both events no longer exist' });
    }

    if (accept === true) {
      // --- ACCEPT LOGIC (The core transaction) ---
      
      // 1. Update SwapRequest status
      swapRequest.status = 'ACCEPTED';

      // 2. Swap the owners of the events
      const originalOfferedOwner = offeredSlot.owner;
      offeredSlot.owner = desiredSlot.owner;
      desiredSlot.owner = originalOfferedOwner;

      // 3. Set both event statuses back to 'BUSY'
      offeredSlot.status = 'BUSY';
      desiredSlot.status = 'BUSY';

      // 4. Save all changes
      await swapRequest.save();
      await offeredSlot.save();
      await desiredSlot.save();

      res.json({ msg: 'Swap accepted and executed!', swapRequest });

    } else {
      // --- REJECT LOGIC ---
      
      // 1. Update SwapRequest status
      swapRequest.status = 'REJECTED';

      // 2. Set both event statuses back to 'SWAPPABLE'
      offeredSlot.status = 'SWAPPABLE';
      desiredSlot.status = 'SWAPPABLE';

      // 3. Save all changes
      await swapRequest.save();
      await offeredSlot.save();
      await desiredSlot.save();

      res.json({ msg: 'Swap rejected.', swapRequest });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- Get all swap requests FOR the logged-in user ---
export const getMySwapRequests = async (req, res) => {
    try {
      // Incoming requests: where toUser is me
      const incoming = await SwapRequest.find({ toUser: req.user.id })
        .populate('fromUser', 'name')
        .populate('offeredSlot')
        .populate('desiredSlot');

      // Outgoing requests: where fromUser is me
      const outgoing = await SwapRequest.find({ fromUser: req.user.id })
        .populate('toUser', 'name')
        .populate('offeredSlot')
        .populate('desiredSlot');
        
      res.json({ incoming, outgoing });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
};