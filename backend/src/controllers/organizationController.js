const Organization = require('../models/Organization');

// @desc    Get Current Organization Details
// @route   GET /api/organization
// @access  Private (Scoped to Tenant)
exports.getOrganizationError = async (req, res) => {
    try {
        if (!req.organizationId) {
            return res.status(400).json({ message: 'Organization context missing' });
        }

        const org = await Organization.findById(req.organizationId)
            .select('-subscription.schedules -__v');

        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(org);
    } catch (error) {
        console.error('Get Org Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Organization (Branding, Settings)
// @route   PATCH /api/organization
// @access  Private (Owner/Admin)
exports.updateOrganization = async (req, res) => {
    try {
        if (!req.organizationId) {
            return res.status(400).json({ message: 'Organization context missing' });
        }

        const { name, branding, modulesEnabled } = req.body;

        // Build update object
        let updateFields = {};
        if (name) updateFields.name = name;
        if (branding) updateFields['settings.branding'] = branding;
        if (modulesEnabled) updateFields['settings.modulesEnabled'] = modulesEnabled;

        const org = await Organization.findByIdAndUpdate(
            req.organizationId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-subscription.schedules -__v');

        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(org);
    } catch (error) {
        console.error('Update Org Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
