import express from 'express';
import { applyLeave, getMyLeaves, getLeaveBalance, getPendingLeaves, approveLeave, rejectLeave } from '../controllers/leave.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);
router.get('/balance', protect, getLeaveBalance);
router.get('/pending', protect, getPendingLeaves);
router.put('/approve/:id', protect, approveLeave);
router.put('/reject/:id', protect, rejectLeave);

export default router;
