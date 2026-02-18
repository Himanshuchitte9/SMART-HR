const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    designation: String,
    department: String,
    joinedAt: Date,
    leftAt: Date,
    sourceEmploymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentState',
    },
    verified: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

workHistorySchema.index({ userId: 1, organizationId: 1, sourceEmploymentId: 1 }, { unique: true });

module.exports = mongoose.model('WorkHistory', workHistorySchema);
