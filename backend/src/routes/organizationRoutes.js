const express = require('express');
const { getOrganizationError, updateOrganization } = require('../controllers/organizationController');
const { protect } = require('../middlewares/authMiddleware');
const { requireTenant } = require('../middlewares/tenantMiddleware');
const { authorizeRoles } = require('../middlewares/rbacMiddleware');

const router = express.Router();

// All routes require login and tenant context
router.use(protect);
router.use(requireTenant);

router.get('/', getOrganizationError);
router.patch('/', authorizeRoles('Owner', 'Admin'), updateOrganization);

module.exports = router;
