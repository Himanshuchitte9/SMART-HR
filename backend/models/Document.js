import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['PERSONAL', 'OFFICIAL'],
        required: true
    },
    type: {
        type: String,
        enum: ['AADHAR', 'PAN', 'RESUME', 'OFFER_LETTER', 'RELIEVING_LETTER', 'OTHER'],
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: Date,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
