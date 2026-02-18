const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
        select: false, // Don't return by default
    },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        avatarUrl: { type: String },
        bio: { type: String },
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
    },
    security: {
        mfaEnabled: { type: Boolean, default: false },
        mfaSecret: { type: String, select: false },
        lastLogin: { type: Date },
        passwordChangedAt: { type: Date },
        refreshTokenVersion: { type: Number, default: 0 }, // For invalidation
    },
}, {
    timestamps: true,
});

// Index for email is automatic due to unique: true
module.exports = mongoose.model('User', userSchema);
