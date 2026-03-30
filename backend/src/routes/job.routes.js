const express = require('express');
const router = express.Router();
const { createJob, createJobWithAI, getJobs, getJobById, updateJob, deleteJob, getMyJobs } = require('../controllers/job.controller');
const { completeJob } = require('../controllers/rating.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.get('/', getJobs);
router.get('/my-jobs', authorize('provider'), getMyJobs);
router.post('/', authorize('provider'), createJob);
router.post('/ai-generate', authorize('provider'), createJobWithAI);
router.get('/:id', getJobById);
router.put('/:id', authorize('provider'), updateJob);
router.delete('/:id', authorize('provider'), deleteJob);
router.put('/:jobId/complete', authorize('provider'), completeJob);

module.exports = router;
