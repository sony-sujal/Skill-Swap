const User = require('../models/User');

// Get all users with optional filters
exports.getAllUsers = async (req, res) => {
  try {
    const { search, availability } = req.query;

    const query = { visibility: 'public' };

    if (search) {
      query.$or = [
        { offeredSkills: { $regex: search, $options: 'i' } },
        { wantedSkills: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    if (availability) {
      query.availability = availability;
    }

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    const { name, location, bio, availability, visibility } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, location, bio, availability, visibility },
      { new: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get recommended users based on wanted skills
exports.getRecommendedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const recommended = await User.find({
      _id: { $ne: currentUser._id },
      visibility: 'public',
      offeredSkills: { $in: currentUser.wantedSkills }
    }).select('-password');

    res.json(recommended);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};
