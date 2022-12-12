const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  hashName: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  anotherName: [String],
  artists: [String],
  authors: [String],
  avatar: {
    type: String,
    required: true,
  },
  description: String,
  isDone: {
    type: Boolean,
    default: false,
  },
  category: [String],
  views: {
    type: Number,
    default: 0,
  },
  followers: {
    type: Number,
    default: 0,
  },
  chapters: [
    {
      name: String,
      updateDate: {
        type: Date,
        default: Date.now(),
      },
      views: {
        type: Number,
        required: true,
        default: 0,
      },
      hashName: String,
    },
  ],
});

module.exports = mongoose.model('comic', comicSchema);
