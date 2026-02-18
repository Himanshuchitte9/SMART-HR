const express = require('express');
const { getFeed, createPost, getSuggestions, sendConnectionRequest } = require('../controllers/networkController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/feed', getFeed);
router.post('/posts', createPost);
router.get('/suggestions', getSuggestions);
router.post('/connect/:userId', sendConnectionRequest);

module.exports = router;
