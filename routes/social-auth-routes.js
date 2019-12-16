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

// callback route for google to redirect to
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/signin',
    session: false,
  }),
  (req, res) => {
    makeToken(req.user, (token) => {
      console.log('jwt log:', jwt);
      const htmlWithToken = `
    <html>
      <script>
        // save JWT to local storage
        window.localStorage.setItem('token', '${token}')
        // redirect browser to dashboard of application
        console.log('stuff is doing stuff in html script')
        window.location.href = 'http://localhost:3000/dashboard';
      </script>
    </html>
    `;

      res.send(htmlWithToken);
    });
  },
);

module.exports = router;
