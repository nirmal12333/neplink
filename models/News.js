const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Politics', 'Culture', 'Technology', 'Business', 'Sports', 'Other']
  },
  author: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  tags: [{
    type: String
  }],
  published: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('News', newsSchema);