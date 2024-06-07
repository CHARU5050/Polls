const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DemoSchema = new Schema({
  question: { type: String, required: true },
  options: [{
    id: { type: Number, required: true },
    option_text: { type: String, required: true },
    vote_count: { type: Number, default: 0 },
  }],
  openvote: { type: Boolean, default: true },
});

module.exports = mongoose.model('Demo', DemoSchema);
