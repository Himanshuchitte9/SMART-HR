import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetAudience: {
        type: String,
        enum: ['ALL', 'EMPLOYEES', 'ADMINS'],
        default: 'ALL'
    },
    expiryDate: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
