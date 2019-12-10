const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const keys = require('../config/keys');
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

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
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
      },
      (accessToken, refreshToken, profile, done) => {
        // passport callback function
        // check if user already exists
        User.findOne({ googleId: profile.id }).then((existingUser) => {
          console.log('profile:', profile);
          if (existingUser) {
            //if they exist, get them
            console.log('existing user found:', existingUser);
            done(null, existingUser);
          } else {
            // if not, create user in db
            try {
              newUser = User.create({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.picture,
              }).then((newUser) => {
                console.log('New user created:', newUser);
                done(null, newUser);
              });
            } catch (err) {
              console.log('Error creating user:', err);
              done(err, null);
            }
          }
        });
      },
    ),
  );
};
