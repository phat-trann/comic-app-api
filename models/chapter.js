const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  hashName: {
    type: String,
    unique: true,
    required: true,
  },
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
});

module.exports = mongoose.model('chapter', comicSchema);
