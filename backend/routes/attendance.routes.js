import express from 'express';
import { clockIn, clockOut, getTodayStatus, getMyHistory } from '../controllers/attendance.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/clock-in', protect, clockIn);
router.post('/clock-out', protect, clockOut);
router.get('/today', protect, getTodayStatus);
router.get('/my-history', protect, getMyHistory);

export default router;
