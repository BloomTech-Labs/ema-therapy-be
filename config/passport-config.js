const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const opts = {};
const passport = require('passport');

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);
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

  //  find how to create jwt in git code and remove access token logic

  passport.use(
    new GoogleStrategy(
      {
        // options for the google strategy
        callbackURL: 'http://localhost:5000/auth/auth/google/callback',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      (accessToken, refreshToken, profile, done) => {
        console.log('inside GoogleStrategy');
        console.log('google profile', profile);
        // passport callback function
        // check if user already exists
        User.findOne({ google: { googleId: profile.id } })
          .then((existingUser) => {
            console.log('inside findOne');
            if (existingUser) {
              console.log('user exists');
              //if they exist, get them
              done(null, { ...existingUser, token: accessToken });
            } else {
              console.log('creating user');
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

                      return done(null, { ...newUser, token: accessToken });
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
