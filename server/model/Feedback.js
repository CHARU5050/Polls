const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const feedbackSchema = new Schema({
    username: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Feedback', feedbackSchema);