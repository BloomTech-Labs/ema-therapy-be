const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const makeToken = (user, cb) => {
  let payload = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  console.log('payload is: ', payload);

  // Sign token
  jwt.sign(
    payload,
    process.env.SECRET_OR_KEY,
    {
      expiresIn: 60 * 60 * 24 * 7, // 1 week in seconds
    },
    (err, token) => {
      if (err) throw err;
      cb(token);
    },
  );
};

// auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

/* GET Google Authentication API. */
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"], session:false })
// );

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),

  function(req, res) {
    makeToken(req.user, (token) => {
      res.redirect('http://localhost:3000?token=' + token);
    });
  },
);

module.exports = router;
