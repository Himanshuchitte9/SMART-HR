import express from 'express';
import { createInstitute, getMyInstitutes } from '../controllers/institute.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createInstitute).get(protect, getMyInstitutes);

export default router;
