const mongoose = require('mongoose');
// const dotenv = require('dotenv');


// uri string needs to be changed to a .env var
const connectDB = () => {
    return mongoose.connect("mongodb+srv://admin:test1@moodmusecluster-ydfvy.mongodb.net/test?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });
}
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

module.exports = {
    connectDB: connectDB
}
