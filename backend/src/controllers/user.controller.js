const User = require('../models/User');
const Profile = require('../models/Profile');
const { notifyConnectionRequest, notifyConnectionAccepted } = require('../services/notification.service');

// GET /api/users/profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'name phoneNumber whatsappNumber role language location')
      .populate('savedPosts', 'title category status salary jobType workMode location')
      .populate('connections', 'name phoneNumber role');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/profile
const updateMyProfile = async (req, res) => {
  try {
    const { name, age, whatsappNumber, language, location, skills, qualification, jobCategory, bio, status } = req.body;

    // Update user fields
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (age) userUpdates.age = age;
    if (whatsappNumber) userUpdates.whatsappNumber = whatsappNumber;
    if (language) userUpdates.language = language;
    if (location) {
      userUpdates.location = {
        type: 'Point',
        coordinates: location.coordinates || [0, 0],
        address: location.address || '',
      };
    }

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates, { new: true, runValidators: true });
    }

    // Update profile fields
    const profileUpdates = {};
    if (skills) profileUpdates.skills = skills;
    if (qualification) profileUpdates.qualification = qualification;
    if (jobCategory) profileUpdates.jobCategory = jobCategory;
    if (bio) profileUpdates.bio = bio;
    if (status) profileUpdates.status = status;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      profileUpdates,
      { new: true, runValidators: true }
    ).populate('user', 'name phoneNumber whatsappNumber role language location age');

    res.status(200).json({ success: true, message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['available', 'busy'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be available or busy' });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { status },
      { new: true }
    );

    res.status(200).json({ success: true, message: `Status updated to ${status}`, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/save-job/:jobId
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const profile = await Profile.findOne({ user: req.user._id });

    const alreadySaved = profile.savedPosts.includes(jobId);

    if (alreadySaved) {
      profile.savedPosts = profile.savedPosts.filter((id) => id.toString() !== jobId);
      await profile.save();
      return res.status(200).json({ success: true, message: 'Job removed from saved posts' });
    }

    profile.savedPosts.push(jobId);
    await profile.save();

    res.status(200).json({ success: true, message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/connect/:userId
const toggleConnection = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    const isConnected = profile.connections.includes(userId);

    if (isConnected) {
      profile.connections = profile.connections.filter((id) => id.toString() !== userId);
      await profile.save();
      return res.status(200).json({ success: true, message: 'Connection removed' });
    }

    profile.connections.push(userId);
    await profile.save();

    res.status(200).json({ success: true, message: 'Connection added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/discover  — list all other users for connections (no phone numbers)
const discoverUsers = async (req, res) => {
  try {
    const profiles = await Profile.find({ user: { $ne: req.user._id } })
      .populate('user', 'name role language location')
      .sort({ averageRating: -1 })
      .limit(50);

    res.status(200).json({ success: true, users: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/nearby?radius=10  — find opposite-role users near the requester
const getNearbyUsers = async (req, res) => {
  try {
    const radius = Math.min(Number(req.query.radius) || 10, 50); // km, max 50
    const coords = req.user.location?.coordinates;
    if (!coords || (coords[0] === 0 && coords[1] === 0)) {
      return res.status(400).json({ success: false, message: 'Your location is not set. Please update your profile with your location first.' });
    }
    const oppositeRole = req.user.role === 'worker' ? 'provider' : 'worker';
    const nearbyUsers = await User.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: coords },
          distanceField: 'distanceMeters',
          maxDistance: radius * 1000,
          spherical: true,
          query: { role: oppositeRole, _id: { $ne: req.user._id } },
        },
      },
      { $limit: 60 },
      { $project: { name: 1, role: 1, location: 1, distanceMeters: 1 } },
    ]);

    // Attach profile data
    const enriched = await Promise.all(
      nearbyUsers.map(async (u) => {
        const profile = await Profile.findOne({ user: u._id }).select('averageRating totalRatings status skills jobCategory bio');
        return {
          ...u,
          distanceKm: (u.distanceMeters / 1000).toFixed(1),
          profile: profile || {},
        };
      })
    );

    res.status(200).json({ success: true, users: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/:userId
const getUserById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('user', 'name phoneNumber whatsappNumber role language location age');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/request/:userId — send connection request
const sendConnectionRequest = async (req, res) => {
  try {
    const toUserId = req.params.userId;
    if (toUserId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself' });
    }
    const ConnectionRequest = require('../models/ConnectionRequest');
    const existing = await ConnectionRequest.findOne({ from: req.user._id, to: toUserId });
    if (existing) {
      return res.status(400).json({ success: false, message: existing.status === 'accepted' ? 'Already connected' : 'Request already sent' });
    }
    await ConnectionRequest.create({ from: req.user._id, to: toUserId });
    await notifyConnectionRequest(toUserId, req.user.name);
    res.status(201).json({ success: true, message: 'Connection request sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/requests — get incoming pending requests
const getConnectionRequests = async (req, res) => {
  try {
    const ConnectionRequest = require('../models/ConnectionRequest');
    const requests = await ConnectionRequest.find({ to: req.user._id, status: 'pending' })
      .populate('from', 'name role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/requests/:requestId — accept or reject
const respondToRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'accepted' or 'rejected'
    const ConnectionRequest = require('../models/ConnectionRequest');
    const request = await ConnectionRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    request.status = action;
    await request.save();
    if (action === 'accepted') {
      await Profile.findOneAndUpdate({ user: req.user._id }, { $addToSet: { connections: request.from } });
      await Profile.findOneAndUpdate({ user: request.from }, { $addToSet: { connections: req.user._id } });
      await notifyConnectionAccepted(request.from, req.user.name);
    }
    res.status(200).json({ success: true, message: `Request ${action}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/contact/:userId — get contact info only if connected
const getContactInfo = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).select('connections');
    const isConnected = profile.connections.map(c => c.toString()).includes(req.params.userId);
    if (!isConnected) {
      return res.status(403).json({ success: false, message: 'Not connected' });
    }
    const targetUser = await User.findById(req.params.userId).select('name phoneNumber whatsappNumber');
    res.status(200).json({ success: true, user: targetUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyProfile, updateMyProfile, updateStatus, saveJob, toggleConnection, getUserById, discoverUsers, getNearbyUsers, sendConnectionRequest, getConnectionRequests, respondToRequest, getContactInfo };
