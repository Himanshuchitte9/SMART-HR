const User = require('../models/User');

// @desc    Get Current User Profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Profile
// @route   PATCH /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, bio, avatarUrl } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                'profile.firstName': firstName,
                'profile.lastName': lastName,
                'profile.bio': bio,
                'profile.avatarUrl': avatarUrl
            },
            { new: true }
        );

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
