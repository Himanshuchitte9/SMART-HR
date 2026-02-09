import Task from '../models/Task.js';

// @desc    Assign Task (Admin/Manager)
// @route   POST /api/tasks/assign
// @access  Private (Owner)
const assignTask = async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate, priority } = req.body;
        const assignedBy = req.user._id;

        const task = new Task({
            title,
            description,
            assignedTo,
            assignedBy,
            dueDate,
            priority
        });

        await task.save();

        res.status(201).json({
            message: 'Task assigned successfully',
            task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get My Tasks (Employee)
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ assignedTo: userId })
            .populate('assignedBy', 'name')
            .sort({ dueDate: 1 }); // Urgent tasks first
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Tasks (Admin)
// @route   GET /api/tasks/all
// @access  Private (Owner)
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
            .populate('assignedTo', 'name')
            .populate('assignedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Task Status
// @route   PUT /api/tasks/status/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only assignee or creator can update status
        if (task.assignedTo.toString() !== userId.toString() && task.assignedBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        task.status = status;
        await task.save();

        res.json({ message: 'Task status updated', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { assignTask, getMyTasks, getAllTasks, updateTaskStatus };
