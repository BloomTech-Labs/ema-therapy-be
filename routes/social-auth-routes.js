const express = require('express');
const router = express.Router();
const passport = require('passport');

const makeToken = (user, cb) => {
  let payload = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
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
    console.log('hello', req.user.token);
    const token = req.user.token;
    res.redirect('http://localhost:3000?token=' + token);
  },
);

module.exports = router;
