const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

//db dependencies
const DB = require('./models/index');
const schema = require('./schema/schema');

// authorization dep
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();

// cors enables cors requests, helmet enhances security, morgan views server traffic
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

//function fro checking JWT
// const checkJwt = jwt({
//     secret: jwksRsa.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
//     }),

//     // Validate the audience and the issuer.
//     audience: authConfig.audience, // name of api //identifier in settings
//     issuer: `https://${authConfig.domain}/`, //local host
//     algorithms: ['RS256']
// });

app.use(
  '/backend',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

const PORT = process.env.PORT || 4000;

DB.connectDB().then(async () => {
  app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}!`));
});
