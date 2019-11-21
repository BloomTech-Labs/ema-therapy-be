const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = require('./config/auth-config');

// db dependencies

const schema = require('./schema/schema');

const app = express();

// cors enables cors requests, helmet enhances security, morgan views server traffic
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

//function for checking JWT needs authConfig
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: AUTH0_AUDIENCE, // name of api //identifier in settings
  issuer: `https://${AUTH0_DOMAIN}/`, //local host
  algorithms: ['RS256'],
});

app.use(
  '/backend',
  checkJwt,
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

module.exports = app;
