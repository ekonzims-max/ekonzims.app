const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

function generateToken(userId) {
  return Buffer.from(JSON.stringify({ userId, iat: Date.now() })).toString('base64');
}

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    try {
      console.log('✅ Google OAuth callback triggered');
      console.log('Profile:', JSON.stringify(profile, null, 2));
      
      const email = profile.emails[0].value;
      console.log('Email extracted:', email);
      
      let user = User.findByEmail(email);

      if (!user) {
        console.log('User not found, creating new user...');
        // Create new user via model helper so it's added to the in-memory store
        user = User.create(email, Math.random().toString(36).substring(2, 15), profile.name.givenName || '', profile.name.familyName || '');
        user.emailVerified = true; // Trust Google's verification
        console.log('✅ New user created:', user.id);
      } else {
        console.log('✅ Existing user found:', user.id);
      }

      return done(null, { userId: user.id, user });
    } catch (err) {
      console.error('❌ Google OAuth error:', err);
      return done(err);
    }
  }
));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'FACEBOOK_APP_ID',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'FACEBOOK_APP_SECRET',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'emails']
  },
  (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
      let user = User.findByEmail(email);

      if (!user) {
        // Create new user from Facebook profile
        user = new User(
          email,
          Math.random().toString(36).substring(2, 15), // Random password
          profile.name.givenName || '',
          profile.name.familyName || ''
        );
        user.emailVerified = profile.emails ? true : false; // Trust if email is provided
        User.users = User.users || [];
        User.users.push(user);
      }

      return done(null, { userId: user.id, user });
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser((userId, done) => {
  const user = User.findById(userId);
  done(null, user);
});

module.exports = passport;
