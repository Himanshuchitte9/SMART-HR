import express from 'express';
import { createRole, getRoleTree } from '../controllers/role.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRole);
router.get('/:instituteId', protect, getRoleTree);

export default router;
