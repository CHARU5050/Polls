const mongoose=require('mongoose');
const Schema=mongoose.Schema;





const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  securityQuestion: { type: String },
  answer: { type: String },
  updatedPassword: { type: Date },
  resetPassword: { type: Date }
});



const user = mongoose.model('user', UserSchema);
module.exports = user;