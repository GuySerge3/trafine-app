const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
