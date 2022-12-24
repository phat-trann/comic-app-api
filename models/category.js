const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  assign: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('category', categorySchema);
