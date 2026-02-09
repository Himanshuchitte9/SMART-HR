import express from 'express';
import { assignTask, getMyTasks, getAllTasks, updateTaskStatus } from '../controllers/task.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/assign', protect, admin, assignTask);
router.get('/my-tasks', protect, getMyTasks);
router.get('/all', protect, admin, getAllTasks);
router.put('/status/:id', protect, updateTaskStatus);

export default router;
