const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    vacancies: { type: Number, required: true, min: 1 },
    filledVacancies: { type: Number, default: 0 },
    salary: {
      amount: { type: Number, required: true },
      period: { type: String, enum: ['hourly', 'daily', 'monthly', 'fixed'], default: 'daily' },
    },
    jobType: { type: String, enum: ['part-time', 'full-time'], required: true },
    workMode: { type: String, enum: ['remote', 'offline'], required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      address: { type: String, default: '' },
    },
    status: { type: String, enum: ['open', 'assigned', 'completed', 'closed'], default: 'open' },
    whatsappContact: { type: String, trim: true },
    aiGenerated: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

jobSchema.index({ location: '2dsphere' });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ jobType: 1, workMode: 1 });

module.exports = mongoose.model('Job', jobSchema);
