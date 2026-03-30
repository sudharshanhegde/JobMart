const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  phoneNumber: user.phoneNumber,
  role: user.role,
  language: user.language,
  isVerified: user.isVerified,
  authProvider: user.authProvider,
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, phoneNumber, password, role, recoveryKeyword } = req.body;

    if (!name || !phoneNumber || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (!recoveryKeyword) {
      return res.status(400).json({ success: false, message: 'Security word is required for password recovery' });
    }
    if (!['worker', 'provider'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be worker or provider' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ phoneNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedKeyword = await bcrypt.hash(recoveryKeyword.trim().toLowerCase(), 10);

    const user = await User.create({
      name,
      phoneNumber,
      password: hashedPassword,
      recoveryKeyword: hashedKeyword,
      role,
      authProvider: 'local',
      isVerified: true,
    });

    await Profile.create({ user: user._id });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userPayload(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ success: false, message: 'Phone number and password are required' });
    }

    const user = await User.findOne({ phoneNumber, authProvider: 'local' }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userPayload(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/google/callback — called by passport, issues JWT and redirects
const googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  const user = userPayload(req.user);
  // Redirect to frontend with token in query string (frontend will store it)
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendURL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { phoneNumber, recoveryKeyword, newPassword } = req.body;
    if (!phoneNumber || !recoveryKeyword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ phoneNumber, authProvider: 'local' }).select('+recoveryKeyword');
    if (!user || !user.recoveryKeyword) {
      return res.status(404).json({ success: false, message: 'No account found with this phone number' });
    }

    const match = await bcrypt.compare(recoveryKeyword.trim().toLowerCase(), user.recoveryKeyword);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Security word is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, googleCallback, resetPassword };
