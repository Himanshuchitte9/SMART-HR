const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscription: {
        planId: { type: String, enum: ['FREE', 'PRO', 'ENTERPRISE'], default: 'FREE' },
        status: { type: String, enum: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'SUSPENDED'], default: 'ACTIVE' },
        validUntil: { type: Date },
        employeeLimit: { type: Number, default: 5 },
        features: [{ type: String }],
    },
    platformStatus: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'],
        default: 'PENDING',
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'],
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        note: {
            type: String,
        },
    }],
    settings: {
        branding: {
            logoUrl: String,
            primaryColor: String,
        },
        modulesEnabled: {
            payroll: { type: Boolean, default: false },
            recruitment: { type: Boolean, default: false },
        },
    },
    compliance: {
        kycVerified: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
        suspiciousLoginAttempts: { type: Number, default: 0 },
        lastReviewAt: { type: Date },
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Organization', organizationSchema);
