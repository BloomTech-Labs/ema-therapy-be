const mongoose = require('mongoose');
const dotenv = require('dotenv');

mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('connected to database');
});