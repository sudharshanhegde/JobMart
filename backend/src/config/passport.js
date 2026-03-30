const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Profile = require('../models/Profile');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await User.findOne({ phoneNumber: email });
          }

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              phoneNumber: profile.emails?.[0]?.value || `google_${profile.id}`,
              googleId: profile.id,
              authProvider: 'google',
              role: 'worker',
              isVerified: true,
            });
            await Profile.create({ user: user._id });
          } else {
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.isVerified = true;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
