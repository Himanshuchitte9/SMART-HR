import express from 'express';
import { createAnnouncement, getActiveAnnouncements, deactivateAnnouncement } from '../controllers/announcement.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, admin, createAnnouncement);
router.get('/active', protect, getActiveAnnouncements);
router.put('/deactivate/:id', protect, admin, deactivateAnnouncement);

export default router;
