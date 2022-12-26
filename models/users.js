const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  avatar: String,
  level: {
    current: {
      type: Number,
      default: 0,
    },
    exp: {
      type: Number,
      default: 0,
    },
    lastReceived: {
      type: Date,
      default: Date.now(),
    },
  },
  follows: [String],
  likes: [String],
  votes: [String],
  history: [String],
  admin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
