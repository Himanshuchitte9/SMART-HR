import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadDocument, getMyDocuments, getAllDocuments, verifyDocument, deleteDocument } from '../controllers/document.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images, PDFs and Docs Only!');
        }
    }
});

router.post('/upload', protect, upload.single('document'), uploadDocument);
router.get('/my-docs', protect, getMyDocuments);
router.get('/all', protect, admin, getAllDocuments);
router.put('/verify/:id', protect, admin, verifyDocument);
router.delete('/:id', protect, deleteDocument);

export default router;
