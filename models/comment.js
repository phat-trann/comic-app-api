const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    firstName: String,
    lastName: String,
    userName: String,
    id: String,
    avatar: String,
  },
  comicHashName: {
    type: String,
    required: true,
  },
  chapterHashName: {
    type: String,
    required: true,
  },
  message: String,
  replies: [String],
  isReply: {
    type: Boolean,
    required: true,
    default: false,
  },
  vote: {
    like: [String],
    dislike: [String],
  },
  createDate: Date,
});

module.exports = mongoose.model('comment', commentSchema);
