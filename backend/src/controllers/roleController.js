const Role = require('../models/Role');

// @desc    Get all roles for current organization
// @route   GET /api/roles
// @access  Private (Admin/Owner)
exports.getRoles = async (req, res) => {
    try {
        // Assume req.user.organizationId is set by middleware or query param for now
        // For MVP, if SuperAdmin, get all? Or just return system roles + org roles

        let query = { isSystem: true };
        if (req.query.organizationId) {
            query = { $or: [{ isSystem: true }, { organizationId: req.query.organizationId }] };
        }

        const roles = await Role.find(query);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private (Admin/Owner)
exports.createRole = async (req, res) => {
    try {
        const { name, permissions, organizationId } = req.body;

        // Check format
        if (!name) return res.status(400).json({ message: 'Role name required' });

        const role = await Role.create({
            name,
            permissions,
            organizationId, // Should come from context, but body for MVP flexibility
            isSystem: false
        });

        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        if (role.isSystem) {
            return res.status(400).json({ message: 'Cannot delete system role' });
        }

        await role.deleteOne();
        res.json({ message: 'Role removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
