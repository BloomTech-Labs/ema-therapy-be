const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const schema = require('./schema/schema');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const socialAuthRoutes = require('./routes/social-auth-routes');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());

// Passport initialize
app.use(passport.initialize());
require('./config/passport-config.js')(passport);

// Rate Limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

const backendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1000,
  message: 'Too many attempts, please try again after an hour',
});

// routes
app.use('/auth', authLimiter, [authRoutes, socialAuthRoutes]);
app.use(
  '/backend',
  backendLimiter,
  passport.authenticate('jwt', { session: false }),
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

module.exports = app;
