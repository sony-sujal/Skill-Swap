import User from '../models/User.js';
import Swap from '../models/Swap.js';
import Feedback from '../models/Feedback.js';

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSwaps = await Swap.countDocuments();
        const totalFeedbacks = await Feedback.countDocuments();

        res.json({
            totalUsers,
            totalSwaps,
            totalFeedbacks
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
