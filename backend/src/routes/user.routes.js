const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile, updateStatus, saveJob, toggleConnection, getUserById, discoverUsers, getNearbyUsers, sendConnectionRequest, getConnectionRequests, respondToRequest, getContactInfo } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/profile', getMyProfile);
router.get('/nearby', getNearbyUsers);
router.get('/discover', discoverUsers);
router.get('/requests', getConnectionRequests);
router.get('/contact/:userId', getContactInfo);
router.put('/profile', updateMyProfile);
router.put('/status', updateStatus);
router.put('/requests/:requestId', respondToRequest);
router.post('/save-job/:jobId', saveJob);
router.post('/connect/:userId', toggleConnection);
router.post('/request/:userId', sendConnectionRequest);
router.get('/:userId', getUserById);

module.exports = router;
