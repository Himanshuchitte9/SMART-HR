const express = require('express');
const { getAllOrganizations, updateOrganizationStatus, getAnalytics } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware to ensure SuperAdmin
const requireSuperAdmin = (req, res, next) => {
    if (req.user && req.user.isSuperAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'SuperAdmin access required' });
    }
};

router.use(protect);
router.use(requireSuperAdmin);

router.get('/organizations', getAllOrganizations);
router.patch('/organizations/:id/status', updateOrganizationStatus);
router.get('/analytics', getAnalytics);

module.exports = router;
