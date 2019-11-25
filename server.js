const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const schema = require('./schema/schema');
const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = require('./config/auth-config');

const app = express();

// Middlware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

app.use(
  '/backend',
  // checkJwt,
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

module.exports = app;
