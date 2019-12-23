const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const opts = {};
const passport = require('passport');
const { BACKEND_ROOT_DOMAIN } = require('./auth-config');

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_TOKEN_SECRET;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findOne({ email: jwt_payload.email })
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    }),
  );

  passport.use(
    new GoogleStrategy(
      {
        // options for the google strategy
        callbackURL: BACKEND_ROOT_DOMAIN + '/auth/google/redirect',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      (accessToken, refreshToken, profile, done) => {
        // passport callback function
        // check if user already exists using email instead of googleId
        User.findOne({ email: profile._json.email })
          .then((existingUser) => {
            if (existingUser) {
              // if password exists then user has local account
              if (existingUser.password) {
                existingUser.google.username = profile.displayName;
                existingUser.google.googleId = profile.id;
                existingUser.save();
                done(null, existingUser);
              } else {
                //if password does not exist, continue login as Google user
                done(null, existingUser);
              }
            } else {
              // if not, create user in db
              try {
                newUser = User.create({
                  email: profile._json.email,
                  google: {
                    username: profile.displayName,
                    googleId: profile.id,
                  },
                })
                  .then((newUser) => {
                    if (newUser) {
                      //push to front end with
                      return done(null, newUser);
                    }
                    return done(new Error('User object not found'), false);
                  })
                  .catch((err) => {
                    console.log('error in create', err);
                  });
              } catch (err) {
                console.log('Error creating user:', err);
                done(err, null);
              }
            }
          })
          .finally(() => {
            console.log('finally');
          });
      },
    ),
  );
};
