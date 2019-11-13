const mongoose = require('mongoose');



// uri string needs to be changed to a .env var
const connectDB = () => {
    return mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
}
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

module.exports = {
    connectDB: connectDB
}
