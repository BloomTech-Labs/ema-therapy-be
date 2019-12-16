const express = require('express');
const router = express.Router();
const passport = require('passport');

// auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

// callback route for google to redirect to
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/signin',
    session: false,
  }),
  (req, res) => {
    console.log(req);
    res.redirect('http://localhost:3000/dashboard');
  },
);

module.exports = router;
