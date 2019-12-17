const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  prompt: String,
  completedAt: { type: Date, default: Date.now },
  userId: String,
  inputList: [String],
});

module.exports = mongoose.model('Task', taskSchema);
