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
  anotherName: String,
  author: [String],
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
  rating: {
    1: {
      type: Number,
      default: 0,
    },
    2: {
      type: Number,
      default: 0,
    },
    3: {
      type: Number,
      default: 0,
    },
    4: {
      type: Number,
      default: 0,
    },
    5: {
      type: Number,
      default: 0,
    },
    avg: {
      type: Number,
      default: 0,
    },
  },
  chapters: [
    {
      number: {
        type: Number,
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
        type: String,
        required: true,
      },
      /* TODO: Handle comments */
      // comments: [
      //   {
      //     user: {
      //       name: {
      //         type: String,
      //         required: true,
      //       },
      //       level: {
      //         type: Number,
      //         required: true,
      //       },
      //       id: {
      //         type: String,
      //         required: true,
      //       },
      //       avatar: {
      //         type: String,
      //         required: true,
      //       },
      //     },
      //   },
      // ],
    },
  ],
});

module.exports = mongoose.model('comic', comicSchema);
