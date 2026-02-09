import Salary from '../models/Salary.js';
import Payslip from '../models/Payslip.js';
import Attendance from '../models/Attendance.js';

// @desc    Set salary structure (Admin)
// @route   POST /api/payroll/set-salary
// @access  Private (Admin)
const setSalary = async (req, res) => {
    try {
        const { userId, basicSalary, hra, da, deductions } = req.body;

        const netSalary = basicSalary + hra + da - deductions;

        let salary = await Salary.findOne({ user: userId });

        if (salary) {
            // Update existing
            salary.basicSalary = basicSalary;
            salary.hra = hra;
            salary.da = da;
            salary.deductions = deductions;
            salary.netSalary = netSalary;
            salary.effectiveFrom = new Date();
            await salary.save();
        } else {
            // Create new
            salary = new Salary({
                user: userId,
                basicSalary,
                hra,
                da,
                deductions,
                netSalary
            });
            await salary.save();
        }

        res.json({
            message: 'Salary structure updated successfully',
            salary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Generate payslip
// @route   POST /api/payroll/generate
// @access  Private (Admin)
const generatePayslip = async (req, res) => {
    try {
        const { userId, month, year } = req.body;

        // Get salary structure
        const salary = await Salary.findOne({ user: userId });
        if (!salary) {
            return res.status(404).json({ message: 'Salary structure not found for this user' });
        }

        // Calculate attendance days for the month
        const searchPattern = new RegExp(`^${year}-${month.toString().padStart(2, '0')}`);
        const attendanceRecords = await Attendance.find({
            user: userId,
            date: { $regex: searchPattern },
            status: 'PRESENT'
        });

        const attendanceDays = attendanceRecords.length;
        const leaveDays = 0; // Can be calculated from Leave model

        // Check if payslip already exists
        let payslip = await Payslip.findOne({ user: userId, month, year });

        if (payslip) {
            // Update existing
            payslip.salaryDetails = {
                basicSalary: salary.basicSalary,
                hra: salary.hra,
                da: salary.da,
                deductions: salary.deductions,
                netSalary: salary.netSalary
            };
            payslip.attendanceDays = attendanceDays;
            payslip.leaveDays = leaveDays;
            payslip.generatedAt = new Date();
            await payslip.save();
        } else {
            // Create new
            payslip = new Payslip({
                user: userId,
                month,
                year,
                salaryDetails: {
                    basicSalary: salary.basicSalary,
                    hra: salary.hra,
                    da: salary.da,
                    deductions: salary.deductions,
                    netSalary: salary.netSalary
                },
                attendanceDays,
                leaveDays
            });
            await payslip.save();
        }

        res.json({
            message: 'Payslip generated successfully',
            payslip
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's payslips
// @route   GET /api/payroll/my-payslips
// @access  Private
const getMyPayslips = async (req, res) => {
    try {
        const userId = req.user._id;
        const payslips = await Payslip.find({ user: userId }).sort({ year: -1, month: -1 });

        res.json(payslips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's salary structure
// @route   GET /api/payroll/my-salary
// @access  Private
const getMySalary = async (req, res) => {
    try {
        const userId = req.user._id;
        const salary = await Salary.findOne({ user: userId });

        if (!salary) {
            return res.status(404).json({ message: 'Salary structure not set' });
        }

        res.json(salary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { setSalary, generatePayslip, getMyPayslips, getMySalary };
