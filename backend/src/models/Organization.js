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
        planId: { type: String, default: 'FREE' }, // Placeholder for Plan ID
        status: { type: String, enum: ['ACTIVE', 'PAST_DUE', 'CANCELED'], default: 'ACTIVE' },
        validUntil: { type: Date },
    },
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
}, {
    timestamps: true,
});

module.exports = mongoose.model('Organization', organizationSchema);
