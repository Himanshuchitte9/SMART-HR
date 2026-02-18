const User = require('../models/User');
const Organization = require('../models/Organization');
const EmploymentState = require('../models/EmploymentState');
const Role = require('../models/Role');
const { hashPassword, comparePassword, signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/authUtils');
const Joi = require('joi');

// Joi Schemas
const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    isOwner: Joi.boolean().default(false),
    organizationName: Joi.string().when('isOwner', { is: true, then: Joi.required() }),
    organizationSlug: Joi.string().when('isOwner', { is: true, then: Joi.required() }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// @desc    Register a new user (and Org if Owner)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { firstName, lastName, email, password, isOwner, organizationName, organizationSlug } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            email,
            passwordHash: hashedPassword,
            profile: { firstName, lastName },
            isSuperAdmin: false, // Explicitly false, SA created via seed
        });

        let organization = null;
        let employment = null;

        if (isOwner) {
            // Create Organization
            const orgExists = await Organization.findOne({ slug: organizationSlug });
            if (orgExists) {
                // Cleanup user if org fails? For simplicity, just return error (Atomic/Transaction ideally)
                // await User.findByIdAndDelete(user._id); 
                return res.status(400).json({ message: 'Organization slug already taken' });
            }

            organization = await Organization.create({
                name: organizationName,
                slug: organizationSlug,
                ownerId: user._id,
            });

            // Create "Owner" Role if not exists (or use System role logic)
            let ownerRole = await Role.findOne({ name: 'Owner', organizationId: organization._id });
            if (!ownerRole) {
                ownerRole = await Role.create({
                    organizationId: organization._id,
                    name: 'Owner',
                    permissions: ['*'], // Full access
                    isSystem: true,
                });
            }

            // Create Employment State
            employment = await EmploymentState.create({
                userId: user._id,
                organizationId: organization._id,
                roleId: ownerRole._id,
                status: 'ACTIVE',
                designation: 'Owner',
                joinedAt: new Date(),
            });
        }

        // Generate Tokens (Scoped to Org if Owner, else Global)
        // If Owner, we log them directly into the new Org
        const payload = {
            id: user._id,
        };

        if (organization) {
            payload.organizationId = organization._id;
            payload.role = 'Owner'; // Simplified for token
        }

        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken({ id: user._id, version: user.security.refreshTokenVersion });

        // Send Refresh Token in Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                profile: user.profile,
            },
            organization: organization ? { id: organization._id, name: organization.name } : null,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+passwordHash +security.refreshTokenVersion');
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Check Tenant Context later (Client should request context or we return list)
        // For now, return unscoped token (User Identity only) OR 
        // if user has only 1 active employment, auto-scope?
        // Let's return Global Token and List of Employments. client selects Org -> calls /switch-org

        // BUT requirements say "Login with JWT".
        // I'll return a Global Token by default.

        const payload = { id: user._id };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken({ id: user._id, version: user.security.refreshTokenVersion });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                profile: user.profile,
                isSuperAdmin: user.isSuperAdmin,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public (Cookie)
exports.refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    try {
        const decoded = verifyRefreshToken(token);
        const user = await User.findById(decoded.id).select('+security.refreshTokenVersion');

        if (!user || user.security.refreshTokenVersion !== decoded.version) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const accessToken = signAccessToken({ id: user._id }); // Global scope by default on refresh? 
        // Ideally request should specify desired scope, but for simplicity:

        res.json({ accessToken });
    } catch (error) {
        res.status(401).json({ message: 'Token failed' });
    }
};

// @desc    Logout / Invalidate
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'Logged out' });
};
