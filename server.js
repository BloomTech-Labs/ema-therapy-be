const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const schema = require('./schema/schema');
const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = require('./config/auth-config');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');

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

// Passport initialize
app.use(passport.initialize());
require('./config/passport-config.js')(passport);

// const checkJwt = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
//   }),

//   // Validate the audience and the issuer.
//   audience: AUTH0_AUDIENCE,
//   issuer: `https://${AUTH0_DOMAIN}/`,
//   algorithms: ['RS256'],
// });

// routes
app.use('/auth');
app.use(
  '/backend',
  // checkJwt,
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

module.exports = app;
