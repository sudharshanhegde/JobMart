const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverNote: { type: String, trim: true },
    proposedSalary: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'filled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
