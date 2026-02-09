import express from 'express';
import { registerUser, loginUser, updateProfile } from '../controllers/auth.controller.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);

export default router;
