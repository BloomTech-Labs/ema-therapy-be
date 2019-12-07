require('dotenv').config();
const DB = require('./models');
const server = require('./server');
const PORT = process.env.PORT || 5000;

DB.connectDB().then(async () => {
  server.listen(PORT, () =>
    console.log(`🚀  Server listening on port ${PORT}!`),
  );
});
