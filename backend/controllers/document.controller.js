import Document from '../models/Document.js';
import User from '../models/User.js';

// @desc    Upload Document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
    try {
        const { title, category, type, userId } = req.body;
        const uploaderId = req.user._id;
        const uploaderRole = req.user.purpose; // OWNER / EMPLOYEE

        // If Owner uploading, they can upload for anyone.
        // If Employee uploading, they can only upload for themselves.
        let targetUser = userId;
        if (uploaderRole !== 'OWNER' || !userId) {
            targetUser = uploaderId;
        }

        // Check file
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path.replace(/\\/g, "/"); // Normalize path

        const document = new Document({
            user: targetUser,
            title,
            category,
            type,
            filePath,
            uploadedBy: uploaderId,
            verified: uploaderRole === 'OWNER' // Auto-verify if uploaded by Owner
        });

        await document.save();

        res.status(201).json({
            message: 'Document uploaded successfully',
            document
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get My Documents
// @route   GET /api/documents/my-docs
// @access  Private
const getMyDocuments = async (req, res) => {
    try {
        const userId = req.user._id;
        const documents = await Document.find({ user: userId }).sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Documents (Admin)
// @route   GET /api/documents/all
// @access  Private (Owner)
const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify Document (Admin)
// @route   PUT /api/documents/verify/:id
// @access  Private (Owner)
const verifyDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const verifierId = req.user._id;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        document.verified = true;
        document.verifiedBy = verifierId;
        document.verifiedAt = new Date();

        await document.save();

        res.json({
            message: 'Document verified successfully',
            document
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete Document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const role = req.user.purpose;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Only Owner or Document Owner can delete
        if (role !== 'OWNER' && document.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this document' });
        }

        await Document.findByIdAndDelete(id);

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { uploadDocument, getMyDocuments, getAllDocuments, verifyDocument, deleteDocument };
