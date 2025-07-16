import User from '../models/User.js';

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// PUT /api/profile
export const updateMyProfile = async (req, res) => {
  const {
    name, location, profilePhoto,
    skillsOffered, skillsWanted, availability, isPublic
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name, location, profilePhoto,
          skillsOffered, skillsWanted, availability, isPublic
        }
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
