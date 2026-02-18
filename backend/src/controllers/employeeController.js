const User = require('../models/User');
const EmploymentState = require('../models/EmploymentState');
const Role = require('../models/Role');
const { hashPassword } = require('../utils/authUtils');

// @desc    List all employees in the organization
// @route   GET /api/organization/employees
// @access  Owner, Admin, Manager
exports.getEmployees = async (req, res) => {
    try {
        const employees = await EmploymentState.find({
            organizationId: req.organizationId
        })
            .populate('userId', 'email profile')
            .populate('roleId', 'name')
            .sort('-joinedAt');

        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add Employee (Invite)
// @route   POST /api/organization/employees
// @access  Owner, Admin
exports.addEmployee = async (req, res) => {
    const { email, firstName, lastName, roleName, designation, department } = req.body;

    try {
        // 1. Resolve Role
        let role = await Role.findOne({ organizationId: req.organizationId, name: roleName });
        if (!role) {
            // Fallback for system roles if not in DB yet (should be seeded, but for safety)
            // Or return error
            return res.status(400).json({ message: `Role '${roleName}' not found in this organization.` });
        }

        // 2. Find or Create User
        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            const tempPassword = Math.random().toString(36).slice(-8); // Generate random password
            const hashedPassword = await hashPassword(tempPassword);

            user = await User.create({
                email,
                passwordHash: hashedPassword,
                profile: { firstName, lastName },
                security: { passwordChangedAt: null }, // Indicates need to set password
            });

            // TODO: Send Email with tempPassword using EmailService
            console.log(`[Email Mock] Invite sent to ${email} with password: ${tempPassword}`);
        }

        // 3. Check if already employed in this Org
        const existingEmployment = await EmploymentState.findOne({ userId: user._id, organizationId: req.organizationId });
        if (existingEmployment) {
            return res.status(400).json({ message: 'User is already an employee here.' });
        }

        // 4. Create Employment State
        const employment = await EmploymentState.create({
            userId: user._id,
            organizationId: req.organizationId,
            roleId: role._id,
            status: 'ACTIVE', // Or 'INVITED'
            designation,
            department,
            joinedAt: new Date(),
        });

        res.status(201).json({
            message: 'Employee added successfully',
            employment,
            user: { id: user._id, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Employee Role/Details
// @route   PATCH /api/organization/employees/:id
// @access  Owner, Admin
exports.updateEmployee = async (req, res) => {
    const { roleName, designation, department, status } = req.body;

    try {
        const updateFields = { designation, department, status };

        if (roleName) {
            const role = await Role.findOne({ organizationId: req.organizationId, name: roleName });
            if (role) updateFields.roleId = role._id;
        }

        const employment = await EmploymentState.findOneAndUpdate(
            { _id: req.params.id, organizationId: req.organizationId }, // Ensure isolation
            updateFields,
            { new: true }
        );

        if (!employment) return res.status(404).json({ message: 'Employee not found' });

        res.json(employment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
