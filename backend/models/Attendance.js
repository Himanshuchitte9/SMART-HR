import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    }, // Format: YYYY-MM-DD
    clockIn: {
        type: Date
    },
    clockOut: {
        type: Date
    },
    status: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'],
        default: 'ABSENT'
    },
    location: {
        clockInLocation: {
            lat: Number,
            lng: Number,
            address: String
        },
        clockOutLocation: {
            lat: Number,
            lng: Number,
            address: String
        }
    },
    ipAddress: String,
    device: String,
    notes: String
}, {
    timestamps: true
});

// Ensure one record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
