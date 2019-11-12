const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./models/index');
// const schema = require('./schema/schema')

const app = express();

// cors enables cors requests, helmet enhances security, morgan views server traffic
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
const app = express();

// app.use('/graphql', graphqlHTTP({
//     schema,
//     graphiql: true
// }))
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`now listening for requests on port ${PORT}`);
})