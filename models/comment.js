const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comicId: {
    type: String,
    required: true,
  },
  message: String,
  replies: [String],
  vote: {
    like: [String],
    dislike: [String],
  },
});

module.exports = mongoose.model('comment', commentSchema);
