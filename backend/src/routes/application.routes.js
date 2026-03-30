const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus, withdrawApplication } = require('../controllers/application.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.get('/my', authorize('worker'), getMyApplications);
router.post('/:jobId', authorize('worker'), applyForJob);
router.get('/job/:jobId', authorize('provider'), getJobApplications);
router.put('/:applicationId/status', authorize('provider'), updateApplicationStatus);
router.put('/:applicationId/withdraw', authorize('worker'), withdrawApplication);

module.exports = router;
