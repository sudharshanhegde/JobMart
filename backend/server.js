require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./src/config/passport');
const path = require('path');
const connectDB = require('./src/config/db');

// Route imports
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const jobRoutes = require('./src/routes/job.routes');
const applicationRoutes = require('./src/routes/application.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const ratingRoutes = require('./src/routes/rating.routes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin, localhost, any Netlify subdomain, or explicit FRONTEND_URL
    if (
      !origin ||
      origin === 'http://localhost:3000' ||
      origin.endsWith('.netlify.app') ||
      (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
    ) {
      return callback(null, true);
    }
    // Reject without throwing — avoids triggering the 500 error handler
    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Hyperlocal Job Marketplace API is running' });
});

// Serve React build only if it exists (local/ngrok mode)
const buildPath = path.join(__dirname, '../frontend/build');
const fs = require('fs');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
    }
  });
} else {
  app.get('*', (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`App (after build): http://localhost:${PORT}`);
});
