const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: [{ type: String, trim: true }],
    qualification: { type: String, trim: true },
    jobCategory: { type: String, trim: true },
    bio: { type: String, trim: true },
    status: { type: String, enum: ['available', 'busy'], default: 'available' },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profilePicture: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
