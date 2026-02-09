import Attendance from '../models/Attendance.js';

// Get today's date string in YYYY-MM-DD format
const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

// @desc    Clock In
// @route   POST /api/attendance/clock-in
// @access  Private
const clockIn = async (req, req_res) => { // Renamed res to req_res to avoid confusion if needed, but standard is res
    const res = req_res;
    try {
        const userId = req.user._id;
        const today = getTodayDateString();
        const { location, device } = req.body;

        // Check if already clocked in
        let attendance = await Attendance.findOne({ user: userId, date: today });

        if (attendance && attendance.clockIn) {
            return res.status(400).json({ message: 'You have already clocked in today' });
        }

        if (!attendance) {
            attendance = new Attendance({
                user: userId,
                date: today,
                status: 'PRESENT',
                clockIn: new Date(),
                location: {
                    clockInLocation: location
                },
                device,
                ipAddress: req.ip
            });
        } else {
            // If record exists (e.g. absent/leave/late), update it
            attendance.clockIn = new Date();
            attendance.status = 'PRESENT';
            attendance.location.clockInLocation = location;
            attendance.device = device;
            attendance.ipAddress = req.ip;
        }

        await attendance.save();

        res.status(200).json({
            message: 'Clocked in successfully',
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Clock Out
// @route   POST /api/attendance/clock-out
// @access  Private
const clockOut = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = getTodayDateString();
        const { location } = req.body;

        const attendance = await Attendance.findOne({ user: userId, date: today });

        if (!attendance || !attendance.clockIn) {
            return res.status(400).json({ message: 'You have not clocked in today' });
        }

        if (attendance.clockOut) {
            return res.status(400).json({ message: 'You have already clocked out today' });
        }

        attendance.clockOut = new Date();
        attendance.location.clockOutLocation = location;

        // Calculate hours worked (optional logic for Half Day can be added here)

        await attendance.save();

        res.status(200).json({
            message: 'Clocked out successfully',
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Today's Status
// @route   GET /api/attendance/today
// @access  Private
const getTodayStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = getTodayDateString();

        const attendance = await Attendance.findOne({ user: userId, date: today });

        res.json({
            clockedIn: !!(attendance && attendance.clockIn),
            clockedOut: !!(attendance && attendance.clockOut),
            startTime: attendance ? attendance.clockIn : null,
            endTime: attendance ? attendance.clockOut : null,
            totalDuration: null // Can calculate if needed
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Current Month Attendance
// @route   GET /api/attendance/my-history
// @access  Private
const getMyHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { month, year } = req.query;

        // Use current date if not provided
        const date = new Date();
        const currentMonth = month ? parseInt(month) : date.getMonth() + 1;
        const currentYear = year ? parseInt(year) : date.getFullYear();

        // Construct search regex for date string YYYY-MM
        // Since we store date as String YYYY-MM-DD
        const searchPattern = new RegExp(`^${currentYear}-${currentMonth.toString().padStart(2, '0')}`);

        const history = await Attendance.find({
            user: userId,
            date: { $regex: searchPattern }
        }).sort({ date: -1 });

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { clockIn, clockOut, getTodayStatus, getMyHistory };
