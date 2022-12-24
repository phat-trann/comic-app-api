const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
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
  images: {
    type: [String],
    required: true,
  },
  hashName: {
    type: String,
    unique: true,
    required: true,
  },
  comments: [String]
});

module.exports = mongoose.model('chapter', comicSchema);
