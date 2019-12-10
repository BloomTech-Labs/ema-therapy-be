const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  // sub: String,
  firstName: String,
  lastName: String,
  password: {
    type: String,
    required: true,
  },
  isSharingLocation: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  google: {
    username: String,
    googleId: String,
    id: String,
    token: String,
  },
});

module.exports = mongoose.model('User', userSchema);
