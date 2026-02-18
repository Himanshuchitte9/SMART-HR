const Organization = require('../models/Organization');
const User = require('../models/User');
const EmploymentState = require('../models/EmploymentState');

// @desc    Get all organizations
// @route   GET /api/admin/organizations
// @access  SuperAdmin
exports.getAllOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find()
            .populate('ownerId', 'email profile')
            .sort('-createdAt');
        res.json(orgs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve/Suspend Organization
// @route   PATCH /api/admin/organizations/:id/status
// @access  SuperAdmin
exports.updateOrganizationStatus = async (req, res) => {
    const { status } = req.body; // 'ACTIVE', 'SUSPENDED'
    try {
        const org = await Organization.findByIdAndUpdate(
            req.params.id,
            { 'subscription.status': status },
            { new: true }
        );
        res.json(org);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Platform Analytics
// @route   GET /api/admin/analytics
// @access  SuperAdmin
exports.getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrgs = await Organization.countDocuments();
        const activeOrgs = await Organization.countDocuments({ 'subscription.status': 'ACTIVE' });
        const totalEmployments = await EmploymentState.countDocuments();

        res.json({
            totalUsers,
            totalOrgs,
            activeOrgs,
            totalEmployments,
        });
        // Mocking detailed stats for the new dashboard
        const activeSessions = Math.floor(Math.random() * 50) + 10;
        const apiRequests = Math.floor(Math.random() * 5000) + 1000;
        const errorRate = (Math.random() * 1).toFixed(2);

        // Subscription breakdown
        const planStats = {
            free: 12, // Mock
            pro: 5,
            enterprise: 2
        };

        const recentLogs = [
            { id: 1, action: 'User Login', user: 'active_user@example.com', timestamp: new Date() },
            { id: 2, action: 'Organization Created', user: 'new_founder@startup.com', timestamp: new Date(Date.now() - 3600000) },
            { id: 3, action: 'Plan Upgrade', user: 'ceo@bigcorp.com', timestamp: new Date(Date.now() - 7200000) },
        ];

        res.json({
            totalUsers,
            totalOrgs,
            activeOrgs,
            totalEmployments,
            activeSessions,
            apiRequests,
            errorRate,
            planStats,
            recentLogs
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
