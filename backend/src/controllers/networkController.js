const Post = require('../models/Post');
const Connection = require('../models/Connection');
const User = require('../models/User');

// @desc    Get Feed (All posts for now, or friends only)
// @route   GET /api/network/feed
// @access  Registered User
exports.getFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('authorId', 'firstName lastName email profile')
            .sort('-createdAt')
            .limit(20);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create Post
// @route   POST /api/network/posts
// @access  Registered User
exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.create({
            authorId: req.user._id,
            content
        });
        // Populate author for immediate frontend display
        await post.populate('authorId', 'firstName lastName email profile');
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Network Suggestions (Users not connected)
// @route   GET /api/network/suggestions
// @access  Registered User
exports.getSuggestions = async (req, res) => {
    try {
        // Simple logic: return users who are not me
        // Real logic: exclude existing connections
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('firstName lastName email profile headline')
            .limit(10);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Connect Request
// @route   POST /api/network/connect/:userId
// @access  Registered User
exports.sendConnectionRequest = async (req, res) => {
    try {
        const existing = await Connection.findOne({
            requesterId: req.user._id,
            recipientId: req.params.userId
        });

        if (existing) return res.status(400).json({ message: 'Request already sent' });

        await Connection.create({
            requesterId: req.user._id,
            recipientId: req.params.userId
        });

        res.json({ message: 'Request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
