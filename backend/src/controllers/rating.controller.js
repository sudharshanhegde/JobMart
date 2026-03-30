const Rating = require('../models/Rating');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const { createNotification } = require('../services/notification.service');

// POST /api/ratings
const addRating = async (req, res) => {
  try {
    const { jobId, rateeId, value, feedback } = req.body;

    if (value < 1 || value > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only rate after job is completed' });
    }

    if (rateeId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot rate yourself' });
    }

    const existing = await Rating.findOne({ job: jobId, rater: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already rated for this job' });
    }

    const rating = await Rating.create({
      job: jobId,
      rater: req.user._id,
      ratee: rateeId,
      value,
      feedback,
    });

    // Recalculate average rating on the ratee's profile
    const allRatings = await Rating.find({ ratee: rateeId });
    const avg = allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length;

    await Profile.findOneAndUpdate(
      { user: rateeId },
      { averageRating: Math.round(avg * 10) / 10, totalRatings: allRatings.length }
    );

    await createNotification({
      recipient: rateeId,
      type: 'new_rating',
      title: 'New Rating Received',
      message: `You received a ${value}-star rating for the job "${job.title}".`,
      relatedJob: jobId,
    });

    res.status(201).json({ success: true, message: 'Rating submitted', rating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/ratings/user/:userId
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ ratee: req.params.userId })
      .populate('rater', 'name role')
      .populate('job', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: ratings.length, ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/jobs/:jobId/complete  (provider only — marks job as completed)
const completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!['open', 'assigned'].includes(job.status)) {
      return res.status(400).json({ success: false, message: 'Job cannot be marked as completed' });
    }

    job.status = 'completed';
    await job.save();

    // Notify all accepted applicants
    const acceptedApps = await JobApplication.find({ job: job._id, status: 'accepted' });
    for (const app of acceptedApps) {
      await createNotification({
        recipient: app.applicant,
        type: 'job_completed',
        title: 'Job Completed',
        message: `The job "${job.title}" has been marked as completed. You can now rate the provider.`,
        relatedJob: job._id,
      });
    }

    res.status(200).json({ success: true, message: 'Job marked as completed', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addRating, getUserRatings, completeJob };
