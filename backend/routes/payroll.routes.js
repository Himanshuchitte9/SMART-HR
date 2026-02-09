import express from 'express';
import { setSalary, generatePayslip, getMyPayslips, getMySalary } from '../controllers/payroll.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/set-salary', protect, setSalary);
router.post('/generate', protect, generatePayslip);
router.get('/my-payslips', protect, getMyPayslips);
router.get('/my-salary', protect, getMySalary);

export default router;
