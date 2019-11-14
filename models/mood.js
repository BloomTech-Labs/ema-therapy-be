const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moodSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  mood: Number,
  intensity: Number,
  userId: String,
});

module.exports = mongoose.model('Mood', moodSchema);
