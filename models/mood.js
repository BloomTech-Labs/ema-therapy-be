const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moodSchema = new Schema({
  mood: Number,
  activities: [String],
  text: String,
  anxietyLevel: Number,
  sleep: Number,
  createdAt: { type: Date, default: Date.now },
  userId: String,
  weather: String,
});

module.exports = mongoose.model('Mood', moodSchema);
