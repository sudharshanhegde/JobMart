const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const { notifyJobAssigned, notifyApplicationUpdate, notifyJobFilled } = require('../services/notification.service');

// POST /api/applications/:jobId  (worker only)
const applyForJob = async (req, res) => {
  try {
    const { coverNote, proposedSalary } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    if (job.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Providers cannot apply to their own jobs' });
    }

    const existing = await JobApplication.findOne({ job: job._id, applicant: req.user._id });
    if (existing) {
      if (existing.status === 'withdrawn') {
        existing.status = 'pending';
        existing.coverNote = coverNote || existing.coverNote;
        if (proposedSalary) existing.proposedSalary = Number(proposedSalary);
        await existing.save();
        return res.status(200).json({ success: true, message: 'Application re-submitted', application: existing });
      }
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const application = await JobApplication.create({
      job: job._id,
      applicant: req.user._id,
      coverNote,
      ...(proposedSalary && { proposedSalary: Number(proposedSalary) }),
    });

    res.status(201).json({ success: true, message: 'Application submitted', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/applications/my  (worker: own applications)
const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ applicant: req.user._id })
      .populate('job', 'title category salary jobType workMode status location provider startDate endDate')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/applications/job/:jobId  (provider: see applicants for their job)
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await JobApplication.find({ job: req.params.jobId })
      .populate('applicant', 'name phoneNumber whatsappNumber location')
      .sort({ createdAt: -1 });

    // Attach applicant rating from their profile
    const Profile = require('../models/Profile');
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const profile = await Profile.findOne({ user: app.applicant._id }).select('averageRating totalRatings status skills');
        return { ...app.toObject(), applicantProfile: profile };
      })
    );
    // Sort: accepted first, then by rating desc
    enriched.sort((a, b) => {
      if (a.status === 'accepted' && b.status !== 'accepted') return -1;
      if (b.status === 'accepted' && a.status !== 'accepted') return 1;
      return (b.applicantProfile?.averageRating || 0) - (a.applicantProfile?.averageRating || 0);
    });

    res.status(200).json({ success: true, count: enriched.length, applications: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/applications/:applicationId/status  (provider: accept/reject)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be accepted or rejected' });
    }

    const application = await JobApplication.findById(req.params.applicationId).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.job.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (status === 'accepted') {
      const job = application.job;

      if (job.filledVacancies >= job.vacancies) {
        return res.status(400).json({ success: false, message: 'No vacancies left for this job' });
      }

      job.filledVacancies += 1;
      const justFilled = job.filledVacancies >= job.vacancies;
      if (justFilled) {
        job.status = 'assigned';
      }
      await job.save();

      // Auto-set worker status to busy
      const Profile = require('../models/Profile');
      await Profile.findOneAndUpdate({ user: application.applicant }, { status: 'busy' });

      await notifyJobAssigned(application.applicant, job);

      // If job is now fully filled, notify and update all remaining pending applicants
      if (justFilled) {
        const pendingApps = await JobApplication.find({
          job: job._id,
          status: 'pending',
          _id: { $ne: application._id },
        });
        await Promise.all(pendingApps.map(async (pendingApp) => {
          pendingApp.status = 'filled';
          await pendingApp.save();
          await notifyJobFilled(pendingApp.applicant, job);
        }));
      }
    }

    application.status = status;
    await application.save();

    await notifyApplicationUpdate(application.applicant, application, application.job);

    res.status(200).json({ success: true, message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/applications/:applicationId/withdraw  (worker: withdraw own application)
const withdrawApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot withdraw a processed application' });
    }

    application.status = 'withdrawn';
    await application.save();

    res.status(200).json({ success: true, message: 'Application withdrawn' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus, withdrawApplication };
