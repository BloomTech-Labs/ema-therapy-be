const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  prompt: String,
  completedAt: { type: Date, default: Date.now },
  userEmail: String,
  text: String,
  photoUrl: String,
});

module.exports = mongoose.model('Task', taskSchema);
