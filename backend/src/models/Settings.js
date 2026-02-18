const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, // e.g., 'MAINTENANCE_MODE', 'ALLOWED_DOMAINS'
    },
    value: mongoose.Schema.Types.Mixed,
    description: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
