const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    whatsappNumber: { type: String, trim: true },
    role: { type: String, enum: ['worker', 'provider'], required: true },
    language: { type: String, default: 'en' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      address: { type: String, default: '' },
    },
    password: { type: String, select: false },  // null for Google users
    recoveryKeyword: { type: String, select: false }, // hashed security word for password reset
    googleId: { type: String },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
