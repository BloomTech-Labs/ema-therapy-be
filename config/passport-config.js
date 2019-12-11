const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
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
        callbackURL: '/auth/google/redirect',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      (accessToken, refreshToken, profile, done) => {
        // passport callback function
        // check if user already exists
        User.findOne({ google: { googleId: profile.id } }).then(
          (existingUser) => {
            if (existingUser) {
              //if they exist, get them
              done(null, existingUser);
            } else {
              // if not, create user in db
              try {
                newUser = User.create({
                  google: {
                    username: profile.displayName,
                    googleId: profile.id,
                  },
                }).then((newUser) => {
                  if (newUser) {
                    return done(null, newUser);
                  }
                  return done(new Error('User object not found'), false);
                });
              } catch (err) {
                console.log('Error creating user:', err);
                done(err, null);
              }
            }
          },
        );
      },
    ),
  );
};
