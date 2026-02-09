import Leave from '../models/Leave.js';

// @desc    Apply for leave
// @route   POST /api/leave/apply
// @access  Private
const applyLeave = async (req, res) => {
    try {
        const userId = req.user._id;
        const { leaveType, startDate, endDate, reason } = req.body;

        // Calculate total days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (totalDays <= 0) {
            return res.status(400).json({ message: 'Invalid date range' });
        }

        const leave = new Leave({
            user: userId,
            leaveType,
            startDate,
            endDate,
            totalDays,
            reason,
            status: 'PENDING'
        });

        await leave.save();

        res.status(201).json({
            message: 'Leave application submitted successfully',
            leave
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's leave history
// @route   GET /api/leave/my-leaves
// @access  Private
const getMyLeaves = async (req, res) => {
    try {
        const userId = req.user._id;
        const leaves = await Leave.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('approvedBy', 'name');

        res.json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get leave balance
// @route   GET /api/leave/balance
// @access  Private
const getLeaveBalance = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentYear = new Date().getFullYear();

        // Get approved leaves for current year
        const approvedLeaves = await Leave.find({
            user: userId,
            status: 'APPROVED',
            startDate: {
                $gte: new Date(`${currentYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`)
            }
        });

        const totalUsed = approvedLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);

        // Default annual leave allocation
        const annualLeave = {
            sick: 12,
            casual: 12,
            paid: 18
        };

        const usedByType = {
            sick: 0,
            casual: 0,
            paid: 0
        };

        approvedLeaves.forEach(leave => {
            const type = leave.leaveType.toLowerCase();
            if (usedByType[type] !== undefined) {
                usedByType[type] += leave.totalDays;
            }
        });

        res.json({
            totalUsed,
            balance: {
                sick: annualLeave.sick - usedByType.sick,
                casual: annualLeave.casual - usedByType.casual,
                paid: annualLeave.paid - usedByType.paid
            },
            used: usedByType,
            annual: annualLeave
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get pending leave approvals (Admin)
// @route   GET /api/leave/pending
// @access  Private (Admin/Owner)
const getPendingLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ status: 'PENDING' })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve leave
// @route   PUT /api/leave/approve/:id
// @access  Private (Admin/Owner)
const approveLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { comments } = req.body;
        const approverId = req.user._id;

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave application not found' });
        }

        if (leave.status !== 'PENDING') {
            return res.status(400).json({ message: 'Leave already processed' });
        }

        leave.status = 'APPROVED';
        leave.approvedBy = approverId;
        leave.approvalDate = new Date();
        leave.comments = comments;

        await leave.save();

        res.json({
            message: 'Leave approved successfully',
            leave
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reject leave
// @route   PUT /api/leave/reject/:id
// @access  Private (Admin/Owner)
const rejectLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { comments } = req.body;
        const approverId = req.user._id;

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave application not found' });
        }

        if (leave.status !== 'PENDING') {
            return res.status(400).json({ message: 'Leave already processed' });
        }

        leave.status = 'REJECTED';
        leave.approvedBy = approverId;
        leave.approvalDate = new Date();
        leave.comments = comments;

        await leave.save();

        res.json({
            message: 'Leave rejected',
            leave
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { applyLeave, getMyLeaves, getLeaveBalance, getPendingLeaves, approveLeave, rejectLeave };
