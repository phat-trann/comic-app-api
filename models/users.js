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
  age: {
    type: Date,
    required: true,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  avatar: String,
  level: {
    type: Number,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);