const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ratee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, trim: true },
  },
  { timestamps: true }
);

// One rating per rater per job
ratingSchema.index({ job: 1, rater: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
