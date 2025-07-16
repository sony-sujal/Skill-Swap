const Swap = require('../models/Swap');
const User = require('../models/User');

exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const requestId = req.params.id;
    const swap = await Swap.findById(requestId);

    if (!swap || swap.status !== 'completed') {
      return res.status(400).json({ error: 'Invalid request or status' });
    }

    swap.feedback = { rating, comment };
    await swap.save();

    // Update user's average rating
    const targetUserId =
      swap.fromUserId.toString() === req.user.id
        ? swap.toUserId
        : swap.fromUserId;

    const allFeedbacks = await Swap.find({
      $or: [{ fromUserId: targetUserId }, { toUserId: targetUserId }],
      feedback: { $exists: true },
    });

    const avg =
      allFeedbacks.reduce((sum, s) => sum + s.feedback.rating, 0) /
      allFeedbacks.length;

    await User.findByIdAndUpdate(targetUserId, { rating: avg });

    res.json({ message: 'Feedback submitted', feedback: swap.feedback });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
};
