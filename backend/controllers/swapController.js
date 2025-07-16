const Swap = require('../models/Swap');
const User = require('../models/User');

// Create a new swap request
exports.createSwap = async (req, res) => {
  try {
    const { toUserId, offeredSkill, wantedSkill, message } = req.body;
    const fromUserId = req.user.id;

    const newSwap = new Swap({
      fromUserId,
      toUserId,
      offeredSkill,
      wantedSkill,
      message,
      status: 'pending',
    });

    await newSwap.save();
    res.status(201).json(newSwap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create swap request.' });
  }
};

// Get all swap requests for a user
exports.getUserSwaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const swaps = await Swap.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).populate('fromUserId toUserId', 'name profileImg');
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch swap requests.' });
  }
};

// Accept a swap request
exports.acceptSwap = async (req, res) => {
  try {
    const requestId = req.params.id;
    const swap = await Swap.findById(requestId);

    if (!swap) return res.status(404).json({ error: 'Swap not found' });
    if (swap.toUserId.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });

    swap.status = 'accepted';
    await swap.save();

    res.json({ message: 'Swap request accepted', swap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept request.' });
  }
};

// Reject a swap request
exports.rejectSwap = async (req, res) => {
  try {
    const requestId = req.params.id;
    const swap = await Swap.findById(requestId);

    if (!swap) return res.status(404).json({ error: 'Swap not found' });
    if (swap.toUserId.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });

    await Swap.findByIdAndDelete(requestId);
    res.json({ message: 'Swap request rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject request.' });
  }
};

// Complete a swap
exports.completeSwap = async (req, res) => {
  try {
    const requestId = req.params.id;
    const swap = await Swap.findById(requestId);

    if (!swap) return res.status(404).json({ error: 'Swap not found' });
    if (
      swap.fromUserId.toString() !== req.user.id &&
      swap.toUserId.toString() !== req.user.id
    )
      return res.status(403).json({ error: 'Not authorized' });

    swap.status = 'completed';
    await swap.save();

    res.json({ message: 'Swap marked as completed', swap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete request.' });
  }
};
