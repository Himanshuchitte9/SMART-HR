const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    audience: {
        type: String,
        enum: ['ALL', 'OWNERS', 'EMPLOYEES'],
        default: 'ALL',
    },
    severity: {
        type: String,
        enum: ['INFO', 'MAINTENANCE', 'RELEASE', 'WARNING'],
        default: 'INFO',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    activeUntil: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Announcement', announcementSchema);
