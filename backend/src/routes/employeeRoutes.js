const express = require('express');
const { getEmployees, addEmployee, updateEmployee, terminateEmployee } = require('../controllers/employeeController');
const { protect } = require('../middlewares/authMiddleware');
const { requireTenant } = require('../middlewares/tenantMiddleware');
const { authorizeRoles } = require('../middlewares/rbacMiddleware');

const router = express.Router();

// All routes require Auth + Tenant Context make sure to mount with this middleware in app.js or here
router.use(protect);
router.use(requireTenant);

// Only Owner and Managers/Admins can view/manage employees
router.get('/', authorizeRoles('Owner', 'Admin', 'HR Manager'), getEmployees);
router.post('/', authorizeRoles('Owner', 'Admin', 'HR Manager'), addEmployee);
router.patch('/:id', authorizeRoles('Owner', 'Admin'), updateEmployee);
router.patch('/:id/terminate', authorizeRoles('Owner', 'Admin'), terminateEmployee);

module.exports = router;
