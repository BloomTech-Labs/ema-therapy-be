const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskInputSchema = new Schema({
  text: String,
  taskId: String,
});

module.exports = mongoose.model('TaskInput', taskInputSchema);
