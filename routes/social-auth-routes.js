const express = require('express');
const router = express.Router();
const passport = require('passport');

// auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  console.log('google auth response', res);
  res.redirect('http://localhost:3000/dashboard');
});

module.exports = router;
