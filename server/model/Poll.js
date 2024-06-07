const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const pollSchema = new Schema({
    question: { type: String, required: true },
    options: [{
      id: { type: Number, required: true },
      option_text: { type: String, required: true },
      vote_count: { type: Number, default: 0 },
    }],
    username: { type: String, required: true },
    expiration: { type: Date },
    created: { type: Date, default: Date.now },
    starred: { type: Boolean, default: false },
    openvote: { type: Boolean, default: true },
    voters: [{
      username: { type: String, required: true },
      option_index: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    }],
  });


  
  const Poll = mongoose.model('Poll', pollSchema);
  module.exports = Poll;