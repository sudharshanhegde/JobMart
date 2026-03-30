const Job = require('../models/Job');
const { generateJobDescription } = require('../services/ai.service');
const { notifyNewJob } = require('../services/notification.service');
const User = require('../models/User');

// POST /api/jobs  (provider only)
const createJob = async (req, res) => {
  try {
    const { title, category, vacancies, salary, jobType, workMode, location, whatsappContact, startDate, endDate } = req.body;

    const job = await Job.create({
      provider: req.user._id,
      title,
      category,
      vacancies,
      salary,
      jobType,
      workMode,
      location,
      whatsappContact: whatsappContact || req.user.whatsappNumber,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    res.status(201).json({ success: true, message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/jobs/ai-generate  (provider only)
// Generate a job description using mock AI, then create the job
const createJobWithAI = async (req, res) => {
  try {
    const { title, category, vacancies, salary, jobType, workMode, location, whatsappContact, startDate, endDate } = req.body;

    const description = generateJobDescription({ title, category, vacancies, salary, jobType, workMode, location });

    const job = await Job.create({
      provider: req.user._id,
      title,
      description,
      category,
      vacancies,
      salary,
      jobType,
      workMode,
      location,
      whatsappContact: whatsappContact || req.user.whatsappNumber,
      aiGenerated: true,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    res.status(201).json({ success: true, message: 'Job posted with AI description', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/jobs  — search & filter
const getJobs = async (req, res) => {
  try {
    const { category, jobType, workMode, minSalary, maxSalary, status, lat, lng, radius, search } = req.query;

    const filter = { status: status || 'open' };

    if (category) filter.category = { $regex: category, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (workMode) filter.workMode = workMode;
    if (minSalary || maxSalary) {
      filter['salary.amount'] = {};
      if (minSalary) filter['salary.amount'].$gte = Number(minSalary);
      if (maxSalary) filter['salary.amount'].$lte = Number(maxSalary);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let query;

    // Geospatial query if lat/lng/radius provided
    if (lat && lng && radius) {
      query = Job.find({
        ...filter,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseFloat(radius) * 1000, // radius in km -> meters
          },
        },
      });
    } else {
      query = Job.find(filter).sort({ createdAt: -1 });
    }

    const jobs = await query
      .populate('provider', 'name phoneNumber whatsappNumber location')
      .limit(50);

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('provider', 'name phoneNumber whatsappNumber location');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/jobs/:id  (provider only, own jobs)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Job updated', job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/jobs/:id  (provider only, own jobs)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/jobs/my-jobs  (provider: own postings)
const getMyJobs = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const jobs = await Job.find({
      provider: req.user._id,
      $or: [
        { status: { $in: ['open', 'assigned'] } },
        { createdAt: { $gte: thirtyDaysAgo } },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createJob, createJobWithAI, getJobs, getJobById, updateJob, deleteJob, getMyJobs };
