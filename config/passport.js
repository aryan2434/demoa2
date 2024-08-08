const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = function(passport) {
  // Local strategy
  passport.use(User.createStrategy());

  // GitHub strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ oauthId: profile.id });
          if (user) {
            return done(null, user);
          } else {
            const newUser = new User({
              username: profile.username,
              oauthId: profile.id,
              oauthProvider: 'Github',
              created: Date.now()
            });
            const savedUser = await newUser.save();
            return done(null, savedUser);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
