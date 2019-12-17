const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { FRONTEND_ROOT_DOMAIN } = require('../config/auth-config');

// makes a token for sending via URL param
const makeUrlToken = (user, cb) => {
  let payload = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  console.log('payload is: ', payload);

  // Sign token
  jwt.sign(
    payload,
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: 60 * 60 * 24 * 7, // 1 week in seconds
    },
    (err, token) => {
      if (err) throw err;
      cb(token);
    },
  );
};

// endpoint that redirects to google authentication
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

// endpoint for google to give back profile and email
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/',
    scope: ['profile', 'email'],
    session: false,
  }),

  function(req, res) {
    // this function takes the user and makes a token
    makeUrlToken(req.user, (token) => {
      res.redirect(FRONTEND_ROOT_DOMAIN + '?token=' + token);
    });
  },
);

module.exports = router;
