const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL;

const connectDB = () => {
  return mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

module.exports = {
  connectDB: connectDB,
};
