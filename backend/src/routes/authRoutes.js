const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Example protected route for testing
router.get('/me', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;
