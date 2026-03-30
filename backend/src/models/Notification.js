const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['new_job', 'job_assigned', 'job_completed', 'application_update', 'new_rating', 'connection_request', 'connection_accepted'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    relatedApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'JobApplication' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
