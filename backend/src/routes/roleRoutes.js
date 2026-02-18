const express = require('express');
const { getRoles, createRole, deleteRole } = require('../controllers/roleController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
    .get(getRoles)
    .post(createRole);

router.route('/:id')
    .delete(deleteRole);

module.exports = router;
