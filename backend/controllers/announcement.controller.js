import Announcement from '../models/Announcement.js';

// @desc    Create Announcement
// @route   POST /api/announcements/create
// @access  Private (Owner/Admin)
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, priority, targetAudience, expiryDate } = req.body;
        const createdBy = req.user._id;

        const announcement = new Announcement({
            title,
            content,
            priority,
            targetAudience,
            expiryDate,
            createdBy
        });

        await announcement.save();

        res.status(201).json({
            message: 'Announcement posted successfully',
            announcement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Active Announcements (For User)
// @route   GET /api/announcements/active
// @access  Private
const getActiveAnnouncements = async (req, res) => {
    try {
        const today = new Date();

        // Find announcements that are active AND (expiryDate is null OR expiryDate is future)
        const announcements = await Announcement.find({
            active: true,
            $or: [
                { expiryDate: { $gte: today } },
                { expiryDate: null }
            ]
        })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Deactivate Announcement
// @route   PUT /api/announcements/deactivate/:id
// @access  Private (Owner/Admin)
const deactivateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        announcement.active = false;
        await announcement.save();

        res.json({ message: 'Announcement deactivated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { createAnnouncement, getActiveAnnouncements, deactivateAnnouncement };
