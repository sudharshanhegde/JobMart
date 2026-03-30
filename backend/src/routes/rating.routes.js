const express = require('express');
const router = express.Router();
const { addRating, getUserRatings } = require('../controllers/rating.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', addRating);
router.get('/user/:userId', getUserRatings);

module.exports = router;
