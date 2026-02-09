import Institute from '../models/Institute.js';

const createInstitute = async (req, res) => {
    try {
        const { name, type, address } = req.body;

        if (req.user.purpose !== 'OWNER' && req.user.purpose !== 'SUPERADMIN') {
            return res.status(403).json({ message: 'Only Owners can create institutes' });
        }

        const institute = await Institute.create({
            name,
            type,
            address,
            owner_id: req.user.id || req.user._id
        });

        res.status(201).json(institute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.findByOwnerId(req.user.id || req.user._id);
        res.json(institutes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { createInstitute, getMyInstitutes };
