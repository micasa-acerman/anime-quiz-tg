const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: String,
  total_attempts: { type: Number, default: 0 },
  success_attempts: { type: Number, default: 0 },
},
{
  timestamps: true,
});

module.exports = model('User', userSchema);
